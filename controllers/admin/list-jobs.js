import { Job } from '@models';

export default async (req, res) => {
  const { per_page, page, search, status } = req.query;

  // Build filter object
  const filter = {};

  // Filter by search term if provided
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by status if provided
  if (status !== undefined && status !== '') {
    filter.isActive = status === 'true';
  }

  const paginationQuery = { per_page, page };

  const documents = await Job.find(filter)
    .populate('company', 'name email')
    .sort({ createdAt: -1 })
    .paginate(paginationQuery);

  res.status(200).json(documents);
};
