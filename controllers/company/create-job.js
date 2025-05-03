import { Job } from '@models';
import { Types } from 'mongoose';

export default async (req, res) => {
  const { me } = req.user;

  // Insert job

  const job = await Job.create({ ...req.body, company: new Types.ObjectId(String(me)) });

  return res.status(200).json({
    data: job,
    message: 'Job created successfully',
  });
};
