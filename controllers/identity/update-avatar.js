import { generateTokens } from '@functions';
import { Identity } from '@models';
import aws from '@plugins/aws/src';
import { error } from 'express-goodies/mongoose';

export default async (req, res) => {
  const { me } = req.user;
  const { avatar } = req.files || {};

  if (!avatar) {
    throw error(400, 'Avatar is required');
  }

  const document = await Identity.findById(me);

  if (!document) {
    throw error(404, 'Identity not found');
  }

  // Remove old avatar if it exists
  if (document.avatar) {
    const oldKey = aws.getKey(document.avatar);
    await aws.remove(oldKey);
  }

  // Upload new avatar
  const key = aws.createKey({
    name: document._id.toString(),
    extension: `.${avatar.mimetype.split('/')[1]}`,
  });

  await aws.upload(key, avatar.data, { public: true });
  const newAvatarUrl = aws.getPublicUrl(key);

  // Validate updates against schema
  const updatedIdentity = await Identity.findByIdAndUpdate(
    me,
    { $set: { avatar: newAvatarUrl } },
    { new: true, runValidators: true }
  );

  // Generate new token with updated avatar
  const payload = {
    name: updatedIdentity.name,
    email: updatedIdentity.email,
    role: updatedIdentity.role,
    me: updatedIdentity._id,
    avatar: newAvatarUrl,
  };

  const { token } = generateTokens(payload, res);

  return res.status(200).json({
    data: updatedIdentity,
    token,
    message: 'Avatar updated successfully',
  });
};
