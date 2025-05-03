import { error, getAIMatchReport } from '@functions';
import { Application, Job } from '@models';

export default async (req, res) => {
  const { me } = req.user;

  if (!me) {
    throw error(400, 'You must be logged in to list applications');
  }

  const jobs = await Job.find({ company: me });

  const documents = await Application.find({ job: { $in: jobs } })
    .populate('job user')
    .paginate(req.query);

  await Promise.all(
    documents.pages.map(async (doc) => {
      const jobMatchReport = await getAIMatchReport(doc.job._id, doc.user._id, 'company');
      doc.jobMatchReport = jobMatchReport;
    })
  );

  res.status(200).json(documents);
};
