import { error } from '@functions';
import { Application, Job } from '@models';

export default async (req, res) => {
  const documents = await Job.find(Job.filters(req.query))
    .populate('company', 'name avatar')
    .paginate(req.query);

  if (!documents) {
    k;
    throw error(404, 'No jobs found');
  }

  // Only check for application if user is authenticated
  if (req.user?.me) {
    const applications = await Application.find({ user: req.user.me }).select('job status');
    documents.pages.forEach((job) => {
      job.application = applications.find((application) => application.job.equals(job._id));
    });
  }

  return res.status(200).json(documents);
};
