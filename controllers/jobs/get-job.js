import { Application, Job } from '@models';

export default async (req, res) => {
  const { id } = req.params;

  const document = await Job.findById(id).populate('company', 'name avatar description').lean();

  if (!document) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Only check for application if user is authenticated
  if (req.user?.me) {
    const application = await Application.findOne({ job: id, user: req.user.me }).select('status');
    document.application = application;
  }

  res.status(200).json(document);
};
