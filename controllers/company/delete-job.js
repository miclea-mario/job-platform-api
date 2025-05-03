import { Job } from '@models';
import { error } from 'express-goodies/mongoose';

export default async (req, res) => {
  const { me } = req.user;
  const { id } = req.params;

  const document = await Job.findOneAndDelete({ _id: id, company: me });
  if (!document) {
    throw error(404, 'Job not found');
  }

  return res.status(200).json({ data: document, message: 'Job deleted successfully' });
};
