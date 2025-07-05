import { Application, Interview, Job } from '@models';

export default async (req, res) => {
  try {
    const { me } = req.user;

    // Get all jobs for this company
    const jobs = await Job.find({ company: me }).lean();
    const jobIds = jobs.map((job) => job._id);

    // Get all applications for this company's jobs
    const applications = await Application.find({ job: { $in: jobIds } }).lean();
    const applicationIds = applications.map((app) => app._id);

    // Get all interviews for these applications
    const interviews = await Interview.find({ application: { $in: applicationIds } }).lean();

    // Calculate basic stats
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((job) => job.isActive).length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter((app) => app.status === 'Pending').length;
    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter(
      (interview) => interview.reportStatus === 'Generated'
    ).length;

    // Calculate growth percentages (comparing with last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentJobs = jobs.filter((job) => new Date(job.createdAt) >= thirtyDaysAgo).length;
    const recentApplications = applications.filter(
      (app) => new Date(app.createdAt) >= thirtyDaysAgo
    ).length;
    const recentInterviews = interviews.filter(
      (interview) => new Date(interview.createdAt) >= thirtyDaysAgo
    ).length;

    // Calculate growth percentages
    const jobsGrowth = totalJobs > 0 ? Math.round((recentJobs / totalJobs) * 100) : 0;
    const applicationsGrowth =
      totalApplications > 0 ? Math.round((recentApplications / totalApplications) * 100) : 0;
    const interviewsGrowth =
      totalInterviews > 0 ? Math.round((recentInterviews / totalInterviews) * 100) : 0;
    const successRate =
      totalApplications > 0 ? Math.round((completedInterviews / totalApplications) * 100) : 0;

    const stats = {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      totalInterviews,
      completedInterviews,
      successRate,
      growth: {
        jobs: `+${jobsGrowth}%`,
        applications: `+${applicationsGrowth}%`,
        interviews: `+${interviewsGrowth}%`,
        successRate: `+${Math.round(successRate * 0.1)}%`,
      },
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};
