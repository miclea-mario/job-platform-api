import { formatEmail, hashPasswords, paginate, validate } from 'express-goodies/mongoose';
import { model, Schema } from 'mongoose';
import validator from 'validator';

/**
 * Identities manage login related operations
 */
const name = 'identity';
const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isEmail(value),
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    confirmed: {
      type: Boolean,
      default: true,
    },
    confirmedAt: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'company', 'user'],
    },
  },
  { autoCreate: false, timestamps: true }
);

// Set schema plugins
schema.plugin(formatEmail);
schema.plugin(hashPasswords);
schema.plugin(paginate);
schema.plugin(validate);

export default model(name, schema);
