/* eslint-disable no-console */
import { Job, User } from '@models';
import users from '../resources/users';

export async function seed() {
  try {
    console.log('Planting seeds for users...');

    const jobs = await Job.find({
      title: { $in: ['Senior Full Stack Developer', 'Renewable Energy Engineer'] },
    });

    const seeds = await users(jobs);
    await User.insertMany(seeds);

    console.log('✓');
  } catch (err) {
    console.warn('Error! Cannot insert users');
    console.error(err);
  }
}
