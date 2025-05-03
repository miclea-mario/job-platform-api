import { error } from '@functions';
import { Application, Job, User } from '@models';
import { isEmpty } from 'lodash';

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

  const [existingApplication, user] = await Promise.all([
    Application.findOne({ job: jobId, user: me }),
    User.findById(me),
  ]);

  if (existingApplication) {
    return res.status(400).json({ message: 'You have already applied for this job' });
  }

  if (isEmpty(user?.resume)) {
    throw error(400, 'Please upload your resume');
  }

  const application = await Application.create({
    job: jobId,
    company: job.company,
    user: me,
  });

  if (!application) {
    return res.status(400).json({ message: 'Failed to apply for job' });
  }

  return res.status(200).json({ message: 'Application submitted' });
};
