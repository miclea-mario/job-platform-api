import { error } from '@functions';
import { Application, Job } from '@models';

export default async (req, res) => {
  const { me } = req.user;

  if (!me) {
    throw error(400, 'You must be logged in to list interviews');
  }

  const jobs = await Job.find({ company: me });

  const documents = await Application.find({
    job: { $in: jobs },
    interviewDetails: { $exists: true },
  })
    .populate('user', 'name avatar')
    .populate('job', 'title');

  res.status(200).json(documents);
};
