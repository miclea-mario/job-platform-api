import { Application, Job } from '@models';
import { error } from 'express-goodies/mongoose';

export default async (req, res) => {
  const { me } = req.user;

  // Get jobs with pagination
  const documents = await Job.find({ company: me }).paginate(req.query);

  if (!documents) {
    throw error(404, 'No jobs found');
  }

  await Promise.all(
    documents.pages.map(async (doc) => {
      const applicationCount = await Application.countDocuments({ job: doc._id });
      doc.applicationCount = applicationCount;
    })
  );

  return res.status(200).json(documents);
};
