import { error, getAIMatchReport } from '@functions';
import { Application } from '@models';

export default async (req, res) => {
  const { me } = req.user;

  if (!me) {
    throw error(400, 'You must be logged in to list applications');
  }

  const documents = await Application.find({ user: me })
    .populate('job company')
    .paginate(req.query);

  await Promise.all(
    documents.pages.map(async (doc) => {
      const jobMatchReport = await getAIMatchReport(doc.job._id, doc.user._id, 'user');
      doc.jobMatchReport = jobMatchReport;
    })
  );

  res.status(200).json(documents);
};
