const buildPrompt = (job, user) => {
  const jobData = {};
  if (job.company?.name) jobData.company = job.company.name;
  if (job.title) jobData.title = job.title;
  if (job.description) jobData.description = job.description;
  if (job.requiredSkills?.length) jobData.requiredSkills = job.requiredSkills;
  if (job.responsibilities?.length) jobData.responsibilities = job.responsibilities;
  if (job.minimumQualification) jobData.minimumQualification = job.minimumQualification;
  if (job.experienceLevel) jobData.experienceLevel = job.experienceLevel;
  if (job.employmentType) jobData.employmentType = job.employmentType;
  if (job.workplaceType) jobData.workplaceType = job.workplaceType;
  if (job.city) jobData.city = job.city;
  if (job.salary) {
    jobData.salary = {};
    if (job.salary.min) jobData.salary.min = job.salary.min;
    if (job.salary.max) jobData.salary.max = job.salary.max;
    if (Object.keys(jobData.salary).length === 0) delete jobData.salary;
  }

  const candidateData = {};
  if (user.title) candidateData.title = user.title;
  if (user.location) candidateData.location = user.location;
  if (user.bio) candidateData.bio = user.bio;
  if (user.skills?.length) candidateData.skills = user.skills;
  if (user.experience?.length) candidateData.experience = user.experience;
  if (user.education?.length) candidateData.education = user.education;
  if (user.location) candidateData.location = user.location;

  return `
  You are an AI assistant providing detailed job-candidate match analysis that will be shown to both job seekers and companies.
  Analyze the job and candidate information below and provide a comprehensive match report in JSON format.

  Return ONLY valid JSON with the following structure:
  {
    "score": A number from 0-100 representing the overall match percentage,
    "company": {
      "overview": A professional summary (2-3 paragraphs) explaining how well the candidate matches with this job. Use professional language as this will be shown to the company,
    },
    "candidate": {
      "overview": A professional summary (2-3 paragraphs) explaining how well the candidate matches with this job. Use professional language as this will be shown to the candidate,
    },
    "strengths": [An array of 3-5 specific strengths the candidate has that are relevant to this job],
    "gaps": [An array of 3-5 gaps or areas for improvement the candidate has for this job],
    "essentialSkills": [
      {
        "name": "A key skill required for this job",
        "score": A number from 0-100 representing the candidate's proficiency
      },
      {
        "name": "A second key skill required for this job",
        "score": A number from 0-100 representing the candidate's proficiency
      },
      {
        "name": "A third key skill required for this job",
        "score": A number from 0-100 representing the candidate's proficiency
      },
      {
        "name": "A fourth key skill required for this job",
        "score": A number from 0-100 representing the candidate's proficiency
      },
      {
        "name": "A fifth key skill required for this job",
        "score": A number from 0-100 representing the candidate's proficiency
      }
    ]
  }

  Job Information:
  ${JSON.stringify(jobData, null, 2)}

  Candidate Information:
  ${JSON.stringify(candidateData, null, 2)}
  `;
};

export default buildPrompt;
