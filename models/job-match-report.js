const { model, Schema } = require('mongoose');
const { validate } = require('express-goodies/mongoose');

const name = 'JobMatchReport';
const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'job',
      required: true,
    },
    score: Number,
    company: {
      overview: String,
    },
    candidate: {
      overview: String,
    },
    strengths: [String],
    gaps: [String],
    essentialSkills: [
      {
        name: String,
        score: Number,
      },
    ],
  },
  { timestamps: true }
);

schema.index({ user: 1, job: 1 }, { unique: true });

schema.plugin(validate);

module.exports = model(name, schema);
