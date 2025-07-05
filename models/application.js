const { model, Schema } = require('mongoose');
const { paginate, validate } = require('express-goodies/mongoose');
const { APPLICATION_STATUS } = require('constants/application');

const name = 'application';
const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'company',
      required: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'job',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.PENDING,
    },
    interview: {
      type: Schema.Types.ObjectId,
      ref: 'interview',
    },
  },
  { timestamps: true }
);

schema.plugin(paginate);
schema.plugin(validate);

module.exports = model(name, schema);
