import { COMPANY_SIZE } from 'constants/company';
import { paginate, validate } from 'express-goodies/mongoose';
import { Schema } from 'mongoose';
import Identity from './identity';

const name = 'company';
const schema = new Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ['company'],
      default: 'company',
    },
    description: {
      type: String,
    },
    industry: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      trim: true,
    },
    address: String,
    city: String,
    country: String,
    postalCode: String,
    foundedYear: Number,
    companySize: {
      type: String,
      enum: COMPANY_SIZE,
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    values: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { autoCreate: false, timestamps: true }
);

schema.plugin(paginate);
schema.plugin(validate);

export default Identity.discriminator(name, schema);
