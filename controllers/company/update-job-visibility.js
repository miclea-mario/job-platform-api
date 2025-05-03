import { Job } from '@models';
import { error } from 'express-goodies/mongoose';
import { isBoolean } from 'lodash';

export default async (req, res) => {
  const { me } = req.user;
  const { id } = req.params;
  const { isActive } = req.body;

  if (!id || isActive === undefined) {
    throw error(400, 'Missing required params');
  }

  if (!isBoolean(isActive)) {
    throw error(400, 'isActive must be boolean');
  }

  const document = await Job.findOne({ _id: id, company: me });
  if (!document) {
    throw error(404, 'Job not found');
  }

  document.isActive = isActive;
  await document.save();

  const message = isActive ? 'activated' : 'deactivated';
  return res.status(200).json({ data: document, message: `Job ${message}` });
};
