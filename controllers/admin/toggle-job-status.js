import { error } from '@functions';
import { Job } from '@models';

export default async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw error(400, 'Job ID is required');
  }

  const job = await Job.findById(id);
  if (!job) {
    throw error(404, 'Job not found');
  }

  // Toggle the active status
  job.isActive = !job.isActive;
  await job.save();

  return res.status(200).json({
    message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`,
    job: {
      _id: job._id,
      title: job.title,
      company: job.company,
      isActive: job.isActive,
    },
  });
};
