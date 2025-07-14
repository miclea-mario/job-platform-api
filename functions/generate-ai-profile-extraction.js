const axios = require('axios');
const { default: buildProfileExtractionPrompt } = require('./build-profile-extraction-prompt');

const generateAIProfileExtraction = async (extractedText) => {
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error('Resume text is required for profile extraction');
  }

  // Don't attempt AI extraction if text is too short (likely not a real resume)
  if (extractedText.trim().length < 100) {
    throw new Error('Resume text too short for meaningful extraction');
  }

  const prompt = buildProfileExtractionPrompt(extractedText);

  try {
    const response = await axios.post(
      `${process.env.AI_API_ENDPOINT}/api/v1/chat/completions`,
      {
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
        include_functions_info: false,
        include_retrieval_info: false,
        include_guardrails_info: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.AI_API_KEY || ''}`,
        },
        timeout: 30000, // 30 second timeout
      }
    );

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('Invalid response from AI service');
    }

    const rawContent = response.data.choices[0].message.content;

    if (!rawContent) {
      throw new Error('No content received from AI service');
    }

    // Remove any potential markdown code block formatting
    const cleanedContent = rawContent
      .replace(/^```json\s*/, '') // Remove opening json code block
      .replace(/^```\s*/, '') // Remove opening generic code block
      .replace(/\s*```$/, ''); // Remove closing code block

    let extractedData;
    try {
      extractedData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('AI returned invalid JSON response');
    }

    // Clean up and validate the extracted data
    return cleanExtractedProfileData(extractedData);
  } catch (error) {
    console.error('Error generating AI profile extraction:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new Error('AI service is currently unavailable');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('AI service request timed out');
    } else if (error.response && error.response.status === 401) {
      throw new Error('AI service authentication failed');
    } else if (error.response && error.response.status >= 500) {
      throw new Error('AI service is experiencing issues');
    }

    throw new Error('Failed to extract profile data from resume');
  }
};

// Helper function to clean and validate extracted data
function cleanExtractedProfileData(data) {
  const cleaned = {};

  // Clean title
  if (data.title && typeof data.title === 'string' && data.title.trim().length > 0) {
    cleaned.title = data.title.trim();
  }

  // Clean bio
  if (data.bio && typeof data.bio === 'string' && data.bio.trim().length > 0) {
    cleaned.bio = data.bio.trim();
  }

  // Clean skills
  if (Array.isArray(data.skills)) {
    cleaned.skills = data.skills
      .filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
      .map(skill => skill.trim());
  }

  // Clean experience
  if (Array.isArray(data.experience)) {
    cleaned.experience = data.experience
      .filter(exp => exp && exp.title && exp.company)
      .map(exp => {
        const cleanExp = {
          title: exp.title.trim(),
          company: exp.company.trim(),
        };

        if (exp.location) cleanExp.location = exp.location.trim();
        if (exp.startDate) cleanExp.startDate = new Date(exp.startDate);
        if (exp.endDate) cleanExp.endDate = new Date(exp.endDate);
        if (typeof exp.current === 'boolean') cleanExp.current = exp.current;
        if (exp.description) cleanExp.description = exp.description.trim();

        return cleanExp;
      });
  }

  // Clean education
  if (Array.isArray(data.education)) {
    cleaned.education = data.education
      .filter(edu => edu && edu.school)
      .map(edu => {
        const cleanEdu = {
          school: edu.school.trim(),
        };

        if (edu.degree) cleanEdu.degree = edu.degree.trim();
        if (edu.fieldOfStudy) cleanEdu.fieldOfStudy = edu.fieldOfStudy.trim();
        if (edu.startDate) cleanEdu.startDate = new Date(edu.startDate);
        if (edu.endDate) cleanEdu.endDate = new Date(edu.endDate);
        if (typeof edu.current === 'boolean') cleanEdu.current = edu.current;
        if (edu.description) cleanEdu.description = edu.description.trim();

        return cleanEdu;
      });
  }

  // Clean phone
  if (data.phone && typeof data.phone === 'string' && data.phone.trim().length > 0) {
    cleaned.phone = data.phone.trim();
  }

  // Clean location
  if (data.location && typeof data.location === 'string' && data.location.trim().length > 0) {
    cleaned.location = data.location.trim();
  }

  return cleaned;
}

module.exports = generateAIProfileExtraction;
