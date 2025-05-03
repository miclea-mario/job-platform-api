import { generateTokens } from '@functions';
import { Identity } from '@models';
import aws from '@plugins/aws/src';
import { error } from 'express-goodies/mongoose';

export default async (req, res) => {
  const { me } = req.user;

  const document = await Identity.findById(me);

  if (!document) {
    throw error(404, 'Identity not found');
  }

  // Check if avatar exists
  if (!document.avatar) {
    throw error(400, 'No avatar to delete');
  }

  // Remove avatar from AWS
  const key = aws.getKey(document.avatar);
  await aws.remove(key);

  // Update identity to remove avatar
  const updatedIdentity = await Identity.findByIdAndUpdate(
    me,
    { $set: { avatar: null } },
    { new: true, runValidators: true }
  );

  // Generate new token with updated avatar (null)
  const payload = {
    name: updatedIdentity.name,
    email: updatedIdentity.email,
    role: updatedIdentity.role,
    me: updatedIdentity._id,
    avatar: null,
  };

  const { token } = generateTokens(payload, res);

  return res.status(200).json({
    data: updatedIdentity,
    token,
    message: 'Avatar deleted successfully',
  });
};
