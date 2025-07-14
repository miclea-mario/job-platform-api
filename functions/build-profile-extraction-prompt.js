const buildProfileExtractionPrompt = (extractedText) => {
  return `
You are an AI assistant tasked with extracting structured profile data from a resume text.
Analyze the resume text below and extract relevant information to populate a user profile.

Return ONLY valid JSON with the following structure:
{
  "title": "Current job title or most recent position title (string, optional)",
  "bio": "A professional summary or bio based on the resume content (string, 2-3 sentences, optional)",
  "skills": ["Array of technical and professional skills mentioned in the resume"],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "location": "Work location (city, country/state)",
      "startDate": "YYYY-MM-DD format (use first day of month if only month/year available)",
      "endDate": "YYYY-MM-DD format or null if current position",
      "current": true/false,
      "description": "Brief description of role and achievements"
    }
  ],
  "education": [
    {
      "school": "Institution name",
      "degree": "Degree type (e.g., Bachelor, Master, PhD)",
      "fieldOfStudy": "Field of study",
      "startDate": "YYYY-MM-DD format",
      "endDate": "YYYY-MM-DD format or null if current",
      "current": true/false,
      "description": "Additional details about the education (optional)"
    }
  ],
  "phone": "Phone number if mentioned (string, optional)",
  "location": "Current location (city, country/state, optional)"
}

Instructions:
- Extract only information that is clearly stated in the resume
- For dates, if only month/year is provided, use the first day of that month
- If no specific date is provided, leave as null
- For skills, include both technical skills and soft skills mentioned
- For current positions/education, set "current": true and "endDate": null
- If information is not available, omit the field entirely or set to null/empty array as appropriate
- Generate a professional bio based on the overall experience and skills if possible
- Be conservative - only extract information you're confident about

Resume Text:
--- START RESUME ---
${extractedText}
--- END RESUME ---
`;
};

export default buildProfileExtractionPrompt;
