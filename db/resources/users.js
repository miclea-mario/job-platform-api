export default async (jobs) => {
  const fullStackJob = jobs.find((j) => j.title === 'Senior Full Stack Developer');
  const energyJob = jobs.find((j) => j.title === 'Renewable Energy Engineer');

  return [
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      password: 'supersecretpassword',
      role: 'user',
      active: true,
      title: 'Senior Software Engineer',
      bio: 'Passionate software engineer with 8 years of experience in full-stack development',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Solutions Inc',
          location: 'San Francisco, CA',
          startDate: new Date('2020-01-01'),
          current: true,
          description: 'Leading development of cloud-native applications',
        },
        {
          title: 'Software Engineer',
          company: 'StartupCo',
          location: 'San Francisco, CA',
          startDate: new Date('2016-01-01'),
          endDate: new Date('2019-12-31'),
          description: 'Full-stack development using MERN stack',
        },
      ],
      education: [
        {
          school: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: new Date('2012-09-01'),
          endDate: new Date('2016-05-31'),
        },
      ],
      phone: '+1-555-0101',
      location: 'San Francisco, CA',
      applications: [
        {
          job: fullStackJob._id,
          status: 'pending',
          appliedAt: new Date(),
          coverLetter: 'I am excited to apply for this position...',
        },
      ],
      jobPreferences: {
        desiredSalary: {
          min: 130000,
          max: 180000,
          currency: 'USD',
        },
        employmentTypes: ['Full-time', 'Remote'],
        preferredLocations: ['San Francisco, CA', 'Remote'],
        willingToRelocate: false,
      },
    },
    {
      name: 'Emily Chen',
      email: 'emily.chen@example.com',
      password: 'supersecretpassword',
      role: 'user',
      active: true,
      title: 'Mechanical Engineer',
      bio: 'Mechanical engineer with focus on renewable energy systems',
      skills: ['Renewable Energy', 'System Design', 'Project Management', 'AutoCAD'],
      experience: [
        {
          title: 'Mechanical Engineer',
          company: 'Sustainable Solutions',
          location: 'Austin, TX',
          startDate: new Date('2019-06-01'),
          current: true,
          description: 'Design and implementation of renewable energy systems',
        },
      ],
      education: [
        {
          school: 'Texas A&M University',
          degree: 'Master of Science',
          fieldOfStudy: 'Mechanical Engineering',
          startDate: new Date('2017-09-01'),
          endDate: new Date('2019-05-31'),
        },
      ],
      phone: '+1-555-0102',
      location: 'Austin, TX',
      applications: [
        {
          job: energyJob._id,
          status: 'pending',
          appliedAt: new Date(),
          coverLetter: 'With my background in renewable energy systems...',
        },
      ],
      jobPreferences: {
        desiredSalary: {
          min: 90000,
          max: 120000,
          currency: 'USD',
        },
        employmentTypes: ['Full-time'],
        preferredLocations: ['Austin, TX', 'Houston, TX'],
        willingToRelocate: true,
      },
    },
  ];
};
