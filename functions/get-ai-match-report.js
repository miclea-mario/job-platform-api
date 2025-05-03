const { JobMatchReport } = require('@models');
const generateAIMatchReport = require('./generate-ai-match-report');

const getAIMatchReport = async (jobId, userId, role) => {
  if (!['user', 'company'].includes(role)) {
    throw new Error('Please provide a valid role');
  }

  let matchReport = await JobMatchReport.findOne({ job: jobId, user: userId }).lean();

  if (matchReport) {
    return filterReportByRole(matchReport, role);
  }

  matchReport = await generateAIMatchReport(jobId, userId);

  let matchReportDocument = await JobMatchReport.create({
    job: jobId,
    user: userId,
    ...matchReport,
  });

  // Convert Mongoose document to plain JavaScript object
  return filterReportByRole(matchReportDocument.toObject(), role);
};

// Helper function to filter report data based on role
function filterReportByRole(report, role) {
  // Create a clean copy without Mongoose metadata
  const filteredReport = JSON.parse(JSON.stringify(report));

  switch (role) {
    case 'user':
      filteredReport.overview = filteredReport.candidate.overview;
      break;
    case 'company':
      filteredReport.overview = filteredReport.company.overview;
      break;
    default:
      break;
  }

  delete filteredReport.candidate;
  delete filteredReport.company;

  return filteredReport;
}

module.exports = getAIMatchReport;
