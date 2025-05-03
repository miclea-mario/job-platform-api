import { EMPLOYMENT_TYPE } from 'constants/job';
import { Schema } from 'mongoose';
import Identity from './identity';

/**
 * Users are job seekers who can apply to jobs
 */
const name = 'user';
const schema = new Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ['user'],
      default: 'user',
    },
    // Professional Information
    title: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        location: String,
        startDate: Date,
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],
    // Contact Information
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    // Documents
    resume: {
      url: String,
      fileName: String,
      updatedAt: Date,
      extractedText: String,
    },
    // Preferences
    jobPreferences: {
      desiredSalary: {
        min: Number,
        max: Number,
      },
      employmentTypes: [
        {
          type: String,
          enum: Object.values(EMPLOYMENT_TYPE),
        },
      ],
      preferredLocations: [String],
    },
  },
  {
    autoCreate: false,
    timestamps: true,
  }
);

export default Identity.discriminator(name, schema);
