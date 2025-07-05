import { Application, Job } from '@models';

export default async (req, res) => {
  try {
    const { me } = req.user;
    const { page = 1, limit = 10, timeframe = '30' } = req.query;

    // Calculate date range
    const daysAgo = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get jobs with application counts and recent activity
    const jobs = await Job.find({ company: me })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Get application counts for each job
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications = await Application.countDocuments({ job: job._id });
        const recentApplications = await Application.countDocuments({
          job: job._id,
          createdAt: { $gte: startDate },
        });

        // Get application status breakdown
        const applicationsByStatus = await Application.aggregate([
          { $match: { job: job._id } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const statusBreakdown = {};
        applicationsByStatus.forEach(({ _id, count }) => {
          statusBreakdown[_id] = count;
        });

        return {
          ...job,
          totalApplications,
          recentApplications,
          statusBreakdown,
          conversionRate:
            totalApplications > 0
              ? Math.round(((statusBreakdown['Accepted'] || 0) / totalApplications) * 100)
              : 0,
        };
      })
    );

    // Generate chart data for jobs overview
    const chartData = [];
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const jobsCreated = await Job.countDocuments({
        company: me,
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      const applicationsReceived = await Application.countDocuments({
        job: { $in: jobs.map((j) => j._id) },
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      chartData.push({
        date: dateStr,
        jobs: jobsCreated,
        applications: applicationsReceived,
      });
    }

    return res.status(200).json({
      jobs: jobsWithStats,
      chartData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Job.countDocuments({ company: me }),
      },
    });
  } catch (error) {
    console.error('Dashboard jobs error:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard jobs data' });
  }
};
