import { Application, Job } from '@models';

export default async (req, res) => {
  const { me } = req.user;

  const jobs = await Job.find({ company: me }).lean();
  const jobIds = jobs.map((job) => job._id);
  const applications = await Application.find({ job: { $in: jobIds } }).lean();

  return res.status(200).json(applications.length);
};
