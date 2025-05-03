import { error } from '@functions';
import { Identity } from '@models';

export default async (req, res) => {
  const document = await Identity.find({}).paginate(req.query);
  if (!document) {
    throw error(404, 'Identities not found');
  }

  return res.status(200).json(document);
};
