import { error, getAIMatchReport } from '@functions';
import { Application, Job } from '@models';

export default async (req, res) => {
  const documents = await Job.find(Job.filters(req.query))
    .populate('company', 'name avatar')
    .paginate(req.query);

  if (!documents) {
    throw error(404, 'No jobs found');
  }

  // Only check for application if user is authenticated
  if (req.user?.me) {
    const applications = await Application.find({ user: req.user.me }).select('job status');

    for (const job of documents.pages) {
      const application = applications.find((app) => app.job.equals(job._id));
      job.application = application;

      // Get job match report if application exists
      if (application) {
        try {
          const jobMatchReport = await getAIMatchReport(job._id, req.user.me, 'user');
          job.jobMatchReport = jobMatchReport;
        } catch (error) {
          // If no match report exists, continue without it
          job.jobMatchReport = null;
        }
      }
    }
  }

  return res.status(200).json(documents);
};
