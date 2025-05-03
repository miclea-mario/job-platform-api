import { Company } from '@models';
import aws from '@plugins/aws/src';
import { error } from 'express-goodies/mongoose';

export default async (req, res) => {
  const { me } = req.user;
  const updates = { ...req.body };
  const { avatar } = req.files || {};

  const document = await Company.findById(me);

  if (!document) {
    throw error(404, 'Company not found');
  }

  if (avatar) {
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
    updates.avatar = aws.getPublicUrl(key);
  }

  // Validate updates against schema
  const updatedCompany = await Company.findByIdAndUpdate(
    me,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return res.status(200).json({
    data: updatedCompany,
    message: 'Company updated successfully',
  });
};
