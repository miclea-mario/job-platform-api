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
  You are an AI assistant tasked with analyzing an interview transcript to evaluate how well a candidate performed during their interview.
  Focus primarily on what can be observed and evidenced from the actual interview transcript. Use the job and candidate information as context, but base your assessment on the demonstrated performance during the interview conversation.

  Return ONLY valid JSON with the following structure:
  {
    "overallScore": "A number from 0-100 representing the interview performance based primarily on what was demonstrated in the transcript - communication quality, engagement level, response depth, and professionalism shown during the actual interview.",
    "summary": "A concise professional summary (2-3 paragraphs) of how the candidate performed during this specific interview session, focusing on their actual responses, communication style, and engagement level as evidenced in the transcript.",
    "communicationSkills": {
      "score": "A number from 0-100 assessing how clearly and effectively the candidate communicated during the interview as evidenced in the transcript.",
      "assessment": "Detailed assessment of communication skills actually demonstrated in the interview - clarity of responses, ability to articulate thoughts, listening skills, and overall conversational flow."
    },
    "technicalSkills": {
      "score": "A number from 0-100 assessing technical knowledge and problem-solving abilities as demonstrated through their actual responses in the interview.",
      "assessment": "Assessment of technical competency based solely on what the candidate demonstrated during the interview conversation - specific technical discussions, problem-solving approaches shown, and depth of knowledge evidenced in their responses."
    },
    "behavioralAssessment": {
      "score": "A number from 0-100 assessing behavioral qualities and soft skills as observed through the interview interaction.",
      "assessment": "Evaluation of professionalism, confidence, enthusiasm, and interpersonal skills as demonstrated through their actual behavior and responses during the interview conversation."
    },
    "keyStrengths": [
      "An array of 3-5 specific strengths demonstrated during the interview conversation, each supported by direct evidence from the transcript (e.g., 'Provided detailed and well-structured response when discussing X topic' or 'Showed strong analytical thinking when presented with Y scenario')."
    ],
    "areasForImprovement": [
      "An array of 3-5 specific areas where the interview performance could have been stronger, based on what was observed in the transcript (e.g., 'Could have provided more concrete examples when answering questions about experience' or 'Responses to technical questions lacked depth and detail')."
    ]
  }

  IMPORTANT: Base your assessment primarily on the interview transcript. The job and candidate information should only provide context. Focus on what the candidate actually said, how they communicated, their level of engagement, and the quality of their responses during this specific interview session.

  Job Information (for context):
  ${JSON.stringify(jobData, null, 2)}

  Candidate Information (for context):
  ${JSON.stringify(candidateData, null, 2)}

  Interview Transcript (PRIMARY SOURCE for analysis):
  --- START TRANSCRIPT ---
  ${transcript}
  --- END TRANSCRIPT ---
  `;
};

export default buildAIInterviewPrompt;
