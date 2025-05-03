import { getAIMatchReport } from '@functions';
import { Job } from '@models';

export default async (req, res) => {
  const { me } = req.user;
  const { jobId } = req.params;

  if (!me || !jobId) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  const matchReport = await getAIMatchReport(jobId, req.user.me, 'user');

  if (!matchReport) {
    return res.status(404).json({ message: 'Match report not found' });
  }

  return res.status(200).json(matchReport);
};
