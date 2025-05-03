/* eslint-disable no-console */
import { Company, Job } from '@models';
import jobs from '../resources/jobs';

export async function seed() {
  try {
    console.log('Planting seeds for jobs...');

    const companies = await Company.find({
      name: { $in: ['Altex', 'Rockstar Games'] },
    });

    const seeds = await jobs(companies);
    await Job.insertMany(seeds);

    console.log('✓');
  } catch (err) {
    console.warn('Error! Cannot insert jobs');
    console.error(err);
  }
}
