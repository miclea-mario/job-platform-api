import { error, generateTokens } from '@functions';
import { Identity } from '@models';
import bcrypt from 'bcryptjs';

export default async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw error(400, 'Missing required params');
  }

  // Find the user by case-insensitive email search
  // The email should already be lowercase if loginSchema middleware was used
  const identity = await Identity.findOne({ email }).select('+password');
  if (!identity) {
    throw error(400, 'Your email or password are invalid');
  }

  // Block logins for accounts with 5 or more failed attempts
  if (identity?.loginAttempts >= 5) {
    await identity.updateOne({ active: false });
    throw error(400, 'Your account has been locked for security reasons');
  }

  const { id, name, active, confirmed, role, password: passwordFromDb, avatar } = identity;
  if (!active || !confirmed) {
    throw error(400, 'Your account is not active');
  }

  const passwordsMatch = await bcrypt.compare(password, passwordFromDb);
  if (!passwordsMatch) {
    await identity.updateOne({ $inc: { loginAttempts: 1 } });
    throw error(400, 'Your username or password are invalid');
  } else {
    await identity.updateOne({ loginAttempts: 0 });
  }

  // The JWT public data payload
  const payload = { name, email, role, me: id, avatar };

  const { token } = generateTokens(payload, res);

  // Add last login information to the current user
  await identity.updateOne({ lastLoginAt: Date.now() });

  return res.status(200).json({ token, message: 'Authentication successful' });
};
