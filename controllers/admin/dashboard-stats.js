import { Application, Identity, Job } from '@models';

export default async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await Identity.countDocuments({});
    const totalJobs = await Job.countDocuments({});
    const totalApplications = await Application.countDocuments({});

    // Get user statistics
    const activeUsers = await Identity.countDocuments({ active: true });
    const inactiveUsers = totalUsers - activeUsers;

    // Users by role
    const jobSeekers = await Identity.countDocuments({ role: 'user' });
    const companies = await Identity.countDocuments({ role: 'company' });
    const admins = await Identity.countDocuments({ role: 'admin' });

    // Get job statistics
    const activeJobs = await Job.countDocuments({ isActive: true });
    const inactiveJobs = totalJobs - activeJobs;

    // Expired jobs (past deadline)
    const currentDate = new Date();
    const expiredJobs = await Job.countDocuments({
      deadlineDate: { $lt: currentDate },
      isActive: true,
    });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await Identity.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const recentJobs = await Job.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const recentApplications = await Application.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Monthly trends for the last 6 months
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const monthUsers = await Identity.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      const monthJobs = await Job.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      const monthApplications = await Application.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      monthlyTrends.push({
        month: startDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        users: monthUsers,
        jobs: monthJobs,
        applications: monthApplications,
        date: startDate.toISOString(),
      });
    }

    // Calculate growth rates (current month vs previous month)
    const currentMonthData = monthlyTrends[monthlyTrends.length - 1] || { users: 0, jobs: 0 };
    const previousMonthData = monthlyTrends[monthlyTrends.length - 2] || { users: 0, jobs: 0 };

    const calculateGrowthRate = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const userGrowthRate = calculateGrowthRate(currentMonthData.users, previousMonthData.users);
    const jobGrowthRate = calculateGrowthRate(currentMonthData.jobs, previousMonthData.jobs);

    // Platform health metrics
    const userActivityRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
    const jobActivityRate = totalJobs > 0 ? (activeJobs / totalJobs) * 100 : 0;
    const userToCompanyRatio = companies > 0 ? jobSeekers / companies : 0;
    const jobsPerCompany = companies > 0 ? totalJobs / companies : 0;

    const dashboardStats = {
      overview: {
        totalUsers,
        totalJobs,
        totalApplications,
        activeUsers,
        inactiveUsers,
        activeJobs,
        inactiveJobs,
        expiredJobs,
      },
      userStats: {
        jobSeekers,
        companies,
        admins,
        userActivityRate: Math.round(userActivityRate * 100) / 100,
      },
      recentActivity: {
        users: recentUsers,
        jobs: recentJobs,
        applications: recentApplications,
        total: recentUsers + recentJobs + recentApplications,
      },
      growth: {
        userGrowthRate: Math.round(userGrowthRate * 100) / 100,
        jobGrowthRate: Math.round(jobGrowthRate * 100) / 100,
      },
      platformHealth: {
        userActivityRate: Math.round(userActivityRate * 100) / 100,
        jobActivityRate: Math.round(jobActivityRate * 100) / 100,
        userToCompanyRatio: Math.round(userToCompanyRatio * 100) / 100,
        jobsPerCompany: Math.round(jobsPerCompany * 100) / 100,
      },
      monthlyTrends,
    };

    res.status(200).json(dashboardStats);
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard statistics',
      message: error.message,
    });
  }
};
