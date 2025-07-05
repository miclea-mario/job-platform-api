const buildAIInterviewPrompt = (job, user, interview) => {
  const jobData = {};
  if (job.company?.name) jobData.company = job.company.name;
  if (job.title) jobData.title = job.title;
  if (job.description) jobData.description = job.description;
  if (job.requiredSkills?.length) jobData.requiredSkills = job.requiredSkills;
  if (job.responsibilities?.length) jobData.responsibilities = job.responsibilities;

  const candidateData = {};
  if (user.name) candidateData.name = user.name;
  if (user.title) candidateData.title = user.title;
  if (user.skills?.length) candidateData.skills = user.skills;

  const transcript = interview.transcriptText || 'Transcript not available.';

  return `
  You are an AI assistant tasked with analyzing an interview transcript to evaluate a candidate's suitability for a specific job.
  Analyze the job information, candidate information, and the interview transcript below. Provide a comprehensive interview performance report in JSON format.

  Return ONLY valid JSON with the following structure:
  {
    "overallScore": "A number from 0-100 representing the overall interview performance based on the transcript and job requirements.",
    "summary": "A concise professional summary (2-3 paragraphs) of the candidate's performance during the interview, highlighting key strengths and weaknesses relative to the job requirements found in the job description.",
    "communicationSkills": {
      "score": "A number from 0-100 assessing communication clarity, conciseness, and professionalism.",
      "assessment": "Detailed assessment of communication skills observed in the transcript."
    },
    "technicalSkills": {
      "score": "A number from 0-100 assessing technical proficiency relevant to the job.",
      "assessment": "Assessment of technical knowledge and problem-solving skills demonstrated during the interview, referencing specific parts of the transcript if possible."
    },
    "behavioralAssessment": {
      "score": "A number from 0-100 assessing behavioral competencies.",
      "assessment": "Evaluation of teamwork, adaptability, motivation, and cultural fit based on responses in the transcript."
    },
    "keyStrengths": [
      "An array of 3-5 specific strengths demonstrated during the interview, supported by evidence from the transcript (e.g., 'Clearly articulated problem-solving approach for question X')."
    ],
    "areasForImprovement": [
      "An array of 3-5 specific areas for improvement observed during the interview, supported by evidence from the transcript (e.g., 'Could provide more detailed examples of project contributions')."
    ]
  }

  Job Information:
  ${JSON.stringify(jobData, null, 2)}

  Candidate Information:
  ${JSON.stringify(candidateData, null, 2)}

  Interview Transcript:
  --- START TRANSCRIPT ---
  ${transcript}
  --- END TRANSCRIPT ---
  `;
};

export default buildAIInterviewPrompt;
