import { Job } from '@models';
import { Types } from 'mongoose';

export default async (req, res) => {
  const { me } = req.user;
  const { id } = req.params;

  const job = await Job.findOne({
    _id: id,
    company: new Types.ObjectId(String(me)),
  });

  if (!job) {
    return res.status(404).json({
      message: 'Job not found',
    });
  }

  // Update job
  const updatedJob = await Job.findByIdAndUpdate(id, { ...req.body }, { new: true });

  return res.status(200).json({
    data: updatedJob,
    message: 'Job updated successfully',
  });
};
