import {
  EMPLOYMENT_TYPE,
  EXPERIENCE_LEVEL,
  MINIMUM_QUALIFICATION,
  WORKPLACE_TYPE,
} from 'constants/job';
import { addYears } from 'date-fns';

export default async (companies) => {
  const altex = companies.find((c) => c.name === 'Altex');
  const rockstarGames = companies.find((c) => c.name === 'Rockstar Games');

  return [
    {
      company: altex._id,
      title: 'Software Engineer',
      description:
        'We are looking for a skilled Software Engineer to join our team at Altex Romania. The ideal candidate will have experience in developing high-quality software solutions and a passion for technology.',
      numberOfOpenings: 3,
      city: 'Bucharest',
      workplaceType: WORKPLACE_TYPE.HYBRID,
      responsibilities: [
        'Develop and maintain software applications',
        'Collaborate with cross-functional teams to define and design new features',
        'Write clean, scalable, and efficient code',
        'Troubleshoot and debug applications',
      ],
      requiredSkills: ['JavaScript', 'Node.js', 'React', 'TypeScript', 'REST APIs', 'SQL'],
      minimumQualification: MINIMUM_QUALIFICATION.BACHELOR,
      salary: {
        min: 5000,
        max: 8000,
      },
      benefits: [
        'Health insurance',
        'Flexible working hours',
        'Remote work options',
        'Performance bonuses',
      ],
      employmentType: EMPLOYMENT_TYPE.FULL_TIME,
      experienceLevel: EXPERIENCE_LEVEL.MID_LEVEL,
      deadlineDate: addYears(new Date(), 1),
      isActive: true,
    },
    {
      title: 'Software Engineer, C#/Java (All Levels)',
      company: rockstarGames._id,
      description: `At Rockstar Games, we create world-class entertainment experiences.
Become part of a team working on some of the most rewarding, large-scale creative projects to be found in any entertainment medium - all within an inclusive, highly-motivated environment where you can learn and collaborate with some of the most talented people in the industry.
Rockstar Games is on the lookout for a talented software developer who possesses a passion for the craft of software development. The ideal candidate would be someone who strives to enhance and streamline the workflows of our users, to increase people’s ability to work efficiently day-to-day.
This is a full-time, permanent and in-office position based in Rockstar’s state-of-the-art game development studio in Edinburgh, Scotland.
`,
      numberOfOpenings: 5,
      city: 'Edinburgh',
      workplaceType: WORKPLACE_TYPE.ONSITE,
      responsibilities: [
        'Develop and maintain software applications',
        'Collaborate with cross-functional teams to define and design new features',
        'Write clean, scalable, and efficient code',
        'Troubleshoot and debug applications',
      ],
      requiredSkills: ['C#', 'Java', 'SQL', 'REST APIs'],
      minimumQualification: MINIMUM_QUALIFICATION.BACHELOR,
      salary: {
        min: 3000,
        max: 7000,
      },
      benefits: ['Health insurance', '401(k) match', 'Paid time off'],
      employmentType: EMPLOYMENT_TYPE.FULL_TIME,
      experienceLevel: EXPERIENCE_LEVEL.MID_LEVEL,
      deadlineDate: addYears(new Date(), 1),
      isActive: true,
    },
  ];
};
