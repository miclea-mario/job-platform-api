/* eslint-disable no-console */
import { Company } from '@models';
import companies from '../resources/companies';

export async function seed() {
  try {
    console.log('Planting seeds for companies...');

    const seeds = await companies();
    await Company.insertMany(seeds);

    console.log('✓');
  } catch (err) {
    console.warn('Error! Cannot insert companies');
    console.error(err);
  }
}
