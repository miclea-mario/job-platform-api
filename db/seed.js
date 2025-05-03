import { runSeeds } from 'express-goodies/functions';
import { companies, identities, jobs } from './seeds';

const seed = async () => {
  // Add all collection seeds below
  await identities.seed();
  await companies.seed();
  await jobs.seed();
  // await users.seed();
};

const seedMongoDb = async () => {
  await runSeeds(seed);
};

// Execute the seeds
seedMongoDb();
