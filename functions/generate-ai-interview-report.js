const { Application } = require('@models');
const axios = require('axios');
const { default: buildAIInterviewPrompt } = require('./build-ai-interview-prompt');

const generateAIInterviewReport = async (interviewId, transcriptText) => {
  const application = await Application.findOne({ interview: interviewId }).populate(
    'job user interview'
  );
  if (!application) {
    throw new Error('Application not found');
  }

  const { job, user, interview } = application;

  // Ensure the interview object has the latest transcript text
  // (even though it's passed as an argument, the populated interview might be used)
  if (interview && transcriptText) {
    interview.transcriptText = transcriptText;
  }

  const prompt = buildAIInterviewPrompt(job, user, interview);
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
      }
    );

    const rawContent = response.data.choices[0].message.content;

    // Remove any potential markdown code block formatting
    const cleanedContent = rawContent
      .replace(/^```json\s*/, '') // Remove opening json code block
      .replace(/^```\s*/, '') // Remove opening generic code block
      .replace(/\s*```$/, ''); // Remove closing code block

    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error('Error generating AI interview report:', error); // Corrected log message
    throw new Error('Failed to generate interview report'); // Corrected error message
  }
};

module.exports = generateAIInterviewReport;
