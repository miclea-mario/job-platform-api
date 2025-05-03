const { Job, User } = require('@models');
const axios = require('axios');
const { buildPrompt } = require('@functions');
const { isEmpty } = require('lodash');

const generateAIMatchReport = async (jobId, userId) => {
  const [job, user] = await Promise.all([
    Job.findById(jobId).populate('company'),
    User.findById(userId),
  ]);

  if (!job || !user) {
    throw new Error('Job or User not found');
  }

  // Check if user has enough details
  if (isEmpty(user.resume)) {
    throw new Error('User does not have enough details');
  }

  const prompt = buildPrompt(job, user);
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
    console.error('Error generating AI match report:', error);
    throw new Error('Failed to generate match report');
  }
};

module.exports = generateAIMatchReport;
