import { Application, Interview, Job } from '@models';

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

    // Get applications and interviews
    const applications = await Application.find({ job: { $in: jobIds } }).lean();
    const applicationIds = applications.map((app) => app._id);
    const interviews = await Interview.find({ application: { $in: applicationIds } }).lean();

    // Calculate performance metrics
    const totalApplications = applications.length;
    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter((i) => i.reportStatus === 'Generated').length;
    const successfulHires = applications.filter((app) => app.status === 'Accepted').length;

    // Calculate rates
    const interviewRate = totalApplications > 0 ? (totalInterviews / totalApplications) * 100 : 0;
    const completionRate = totalInterviews > 0 ? (completedInterviews / totalInterviews) * 100 : 0;
    const hireRate = totalApplications > 0 ? (successfulHires / totalApplications) * 100 : 0;
    const conversionRate = totalInterviews > 0 ? (successfulHires / totalInterviews) * 100 : 0;

    // Average time to interview (in days)
    const averageTimeToInterview = applications
      .filter((app) => app.interview)
      .reduce((acc, app) => {
        const interview = interviews.find((i) => i._id.toString() === app.interview.toString());
        if (interview && interview.date) {
          const timeDiff = new Date(interview.date) - new Date(app.createdAt);
          return acc + timeDiff / (1000 * 60 * 60 * 24); // Convert to days
        }
        return acc;
      }, 0);

    const avgTimeToInterview =
      applications.filter((app) => app.interview).length > 0
        ? averageTimeToInterview / applications.filter((app) => app.interview).length
        : 0;

    // Performance by job
    const jobPerformance = await Promise.all(
      jobs.map(async (job) => {
        const jobApplications = applications.filter(
          (app) => app.job.toString() === job._id.toString()
        );
        const jobApplicationIds = jobApplications.map((app) => app._id);
        const jobInterviews = interviews.filter((i) =>
          jobApplicationIds.some((appId) => appId.toString() === i.application.toString())
        );

        const jobHires = jobApplications.filter((app) => app.status === 'Accepted').length;
        const jobInterviewRate =
          jobApplications.length > 0 ? (jobInterviews.length / jobApplications.length) * 100 : 0;
        const jobHireRate =
          jobApplications.length > 0 ? (jobHires / jobApplications.length) * 100 : 0;

        return {
          jobId: job._id,
          jobTitle: job.title,
          applications: jobApplications.length,
          interviews: jobInterviews.length,
          hires: jobHires,
          interviewRate: Math.round(jobInterviewRate),
          hireRate: Math.round(jobHireRate),
        };
      })
    );

    // Generate performance chart data
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

      const dayInterviews = await Interview.countDocuments({
        application: { $in: applicationIds },
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      const dayHires = await Application.countDocuments({
        job: { $in: jobIds },
        status: 'Accepted',
        updatedAt: { $gte: dayStart, $lte: dayEnd },
      });

      chartData.push({
        date: dateStr,
        applications: dayApplications,
        interviews: dayInterviews,
        hires: dayHires,
      });
    }

    return res.status(200).json({
      metrics: {
        totalApplications,
        totalInterviews,
        completedInterviews,
        successfulHires,
        interviewRate: Math.round(interviewRate),
        completionRate: Math.round(completionRate),
        hireRate: Math.round(hireRate),
        conversionRate: Math.round(conversionRate),
        averageTimeToInterview: Math.round(avgTimeToInterview),
      },
      jobPerformance,
      chartData,
      summary: {
        bestPerformingJob:
          jobPerformance.length > 0
            ? jobPerformance.reduce((best, current) =>
                current.hireRate > best.hireRate ? current : best
              )
            : null,
        totalJobs: jobs.length,
        activeJobs: jobs.filter((job) => job.isActive).length,
      },
    });
  } catch (error) {
    console.error('Dashboard performance error:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard performance data' });
  }
};
