import { Job } from '@models';

export default async (req, res) => {
  const cities = await Job.distinct('city');
  res.status(200).json(cities);
};
