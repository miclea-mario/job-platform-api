const { model, Schema } = require('mongoose');
const { paginate, validate } = require('express-goodies/mongoose');
const {
  WORKPLACE_TYPE,
  MINIMUM_QUALIFICATION,
  EMPLOYMENT_TYPE,
  EXPERIENCE_LEVEL,
} = require('constants/job');

const name = 'job';
const schema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'company',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    numberOfOpenings: {
      type: Number,
      default: 1,
    },
    // Location Information
    city: {
      type: String,
      trim: true,
    },
    workplaceType: {
      type: String,
      enum: Object.values(WORKPLACE_TYPE),
      required: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requiredSkills: [
      {
        type: String,
        required: true,
      },
    ],
    minimumQualification: {
      type: String,
      enum: Object.values(MINIMUM_QUALIFICATION),
    },
    salary: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    employmentType: {
      type: String,
      enum: Object.values(EMPLOYMENT_TYPE),
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: Object.values(EXPERIENCE_LEVEL),
      required: true,
    },
    deadlineDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

schema.plugin(paginate);
schema.plugin(validate);

schema.statics.filters = (query) => {
  const {
    city,
    title,
    employmentType,
    experienceLevel,
    minimumQualification,
    salaryMin,
    salaryMax,
    workplaceType,
    status = 'all',
  } = query;

  const filter = {};

  filter.isActive = true; // Only active jobs

  if (city) {
    filter.city = new RegExp(city, 'i');
  }

  if (title) {
    filter.title = new RegExp(title, 'i');
  }

  if (employmentType) {
    filter.employmentType = employmentType;
  }

  if (experienceLevel) {
    filter.experienceLevel = experienceLevel;
  }

  if (minimumQualification) {
    filter.minimumQualification = minimumQualification;
  }

  if (workplaceType) {
    filter.workplaceType = workplaceType;
  }

  if (salaryMin || salaryMax) {
    filter.salary = {};
    if (salaryMin) {
      filter.salary.min = { $gte: Number(salaryMin) };
    }
    if (salaryMax) {
      filter.salary.max = { $lte: Number(salaryMax) };
    }
  }

  if (status && status !== 'all') {
    filter.status = status;
  }

  return filter;
};

module.exports = model(name, schema);
