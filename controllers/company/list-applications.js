import { error, getAIMatchReport } from '@functions';
import { Application, Job } from '@models';

export default async (req, res) => {
  const { me } = req.user;
  const { jobId, matchScore, status, per_page } = req.query;

  if (!me) {
    throw error(400, 'You must be logged in to list applications');
  }

  // Get jobs owned by the company
  const jobs = await Job.find({ company: me });
  const jobIds = jobs.map((job) => job._id);

  // Build filter object
  const filter = { job: { $in: jobIds } };

  // Filter by specific jobId if provided (must be owned by the company)
  if (jobId) {
    if (jobIds.some((id) => id.toString() === jobId)) {
      filter.job = jobId;
    } else {
      // If jobId is not owned by company, return empty result
      return res.status(200).json({
        pages: [],
        total: 0,
        pages_count: 0,
        current_page: 1,
        per_page: parseInt(per_page) || 10,
      });
    }
  }

  // Filter by status if provided
  if (status) {
    const statusValues = status.split(',').map((s) => s.trim());
    filter.status = { $in: statusValues };
  }

  // Create pagination query object
  const paginationQuery = { per_page };

  const documents = await Application.find(filter).populate('job user').paginate(paginationQuery);

  // Get AI match reports for all applications
  await Promise.all(
    documents.pages.map(async (doc) => {
      const jobMatchReport = await getAIMatchReport(doc.job._id, doc.user._id, 'company');
      doc.jobMatchReport = jobMatchReport;
    })
  );

  // Filter by match score if provided
  if (matchScore) {
    const scoreRanges = matchScore.split(',').map((s) => s.trim().toLowerCase());

    documents.pages = documents.pages.filter((doc) => {
      const score = doc.jobMatchReport?.score || 0;

      return scoreRanges.some((range) => {
        switch (range) {
          case 'high':
            return score >= 80;
          case 'medium':
            return score >= 50 && score < 80;
          case 'low':
            return score < 50;
          default:
            return false;
        }
      });
    });

    // Update pagination info after filtering
    documents.total = documents.pages.length;
    documents.pages_count = Math.ceil(documents.total / (parseInt(per_page) || 10));
  }

  res.status(200).json(documents);
};
