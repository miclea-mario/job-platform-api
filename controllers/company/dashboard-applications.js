import { Application, Job } from '@models';

export default async (req, res) => {
  try {
    const { me } = req.user;
    const { timeframe = '30' } = req.query;

    // Calculate date range
    const daysAgo = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get all jobs for this company
    const jobs = await Job.find({ company: me }).lean();
    const jobIds = jobs.map((job) => job._id);

    // Get applications with populated job and user data
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Get applications by status
    const applicationsByStatus = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusBreakdown = {};
    applicationsByStatus.forEach(({ _id, count }) => {
      statusBreakdown[_id] = count;
    });

    // Generate chart data for applications over time
    const chartData = [];
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayApplications = await Application.countDocuments({
        job: { $in: jobIds },
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      const pendingCount = await Application.countDocuments({
        job: { $in: jobIds },
        createdAt: { $gte: dayStart, $lte: dayEnd },
        status: 'Pending',
      });

      const acceptedCount = await Application.countDocuments({
        job: { $in: jobIds },
        createdAt: { $gte: dayStart, $lte: dayEnd },
        status: 'Accepted',
      });

      const rejectedCount = await Application.countDocuments({
        job: { $in: jobIds },
        createdAt: { $gte: dayStart, $lte: dayEnd },
        status: 'Rejected',
      });

      chartData.push({
        date: dateStr,
        total: dayApplications,
        pending: pendingCount,
        accepted: acceptedCount,
        rejected: rejectedCount,
      });
    }

    // Get recent activity (last 10 applications)
    const recentActivity = applications.slice(0, 10).map((app) => ({
      id: app._id,
      applicantName: app.user?.name || 'Unknown',
      applicantEmail: app.user?.email || '',
      jobTitle: app.job?.title || 'Unknown Job',
      status: app.status,
      appliedAt: app.createdAt,
      timeAgo: getTimeAgo(app.createdAt),
    }));

    return res.status(200).json({
      applications,
      statusBreakdown,
      chartData,
      recentActivity,
      summary: {
        total: applications.length,
        pending: statusBreakdown['Pending'] || 0,
        accepted: statusBreakdown['Accepted'] || 0,
        rejected: statusBreakdown['Rejected'] || 0,
        interviewed: statusBreakdown['Interviewed'] || 0,
      },
    });
  } catch (error) {
    console.error('Dashboard applications error:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard applications data' });
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
