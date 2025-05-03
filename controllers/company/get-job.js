import { Job } from '@models';
import { error } from 'express-goodies/mongoose';

export default async (req, res) => {
  const { id } = req.params;

  const document = await Job.findById(id);

  if (!document) {
    throw error(404, 'Job not found');
  }

  return res.status(200).json(document);
};
