const { model, Schema } = require('mongoose');
const { paginate, validate } = require('express-goodies/mongoose');
const { INTERVIEW_REPORT_STATUS } = require('constants/interview');

const name = 'interview';
const schema = new Schema(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'application',
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    roomId: {
      type: String,
    },
    transcriptText: {
      type: String,
    },
    reportStatus: {
      type: String,
      enum: INTERVIEW_REPORT_STATUS,
    },
    report: {
      overallScore: {
        type: Number,
      },
      summary: {
        type: String,
      },
      communicationSkills: {
        score: Number,
        assessment: String,
      },
      technicalSkills: {
        score: Number,
        assessment: String,
      },
      behavioralAssessment: {
        score: Number,
        assessment: String,
      },
      keyStrengths: [String],
      areasForImprovement: [String],
    },
  },
  { timestamps: true }
);

schema.plugin(paginate);
schema.plugin(validate);

module.exports = model(name, schema);
