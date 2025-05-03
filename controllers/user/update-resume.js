import { User } from '@models';
import aws from '@plugins/aws/src';
import { error } from 'express-goodies/mongoose';
import pdf from 'pdf-parse';

export default async (req, res) => {
  const { me } = req.user;
  const { resume } = req.files || {};

  if (!resume) {
    throw error(400, 'Resume file is required');
  }

  const user = await User.findById(me);

  if (!user) {
    throw error(404, 'User not found');
  }

  // Remove old resume if it exists
  if (user.resume && user.resume.url) {
    const oldKey = aws.getKey(user.resume.url);
    await aws.remove(oldKey);
  }

  // Upload new resume
  const key = aws.createKey({
    name: `${user._id.toString()}-resume`,
    extension: `.${resume.mimetype.split('/')[1]}`,
  });

  await aws.upload(key, resume.data, { public: true });
  const resumeUrl = aws.getPublicUrl(key);

  // Extract text from PDF
  let extractedText = '';
  try {
    const data = await pdf(resume.data);
    extractedText = data.text
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[\r\n]+/g, ' '); // Replace newlines with spaces
  } catch (err) {
    console.error('Error extracting text from PDF:', err);
    // Continue without extracted text if PDF parsing fails
  }

  // Update user with new resume information and extracted text
  const updatedUser = await User.findByIdAndUpdate(
    me,
    {
      $set: {
        resume: {
          url: resumeUrl,
          fileName: resume.name,
          updatedAt: new Date(),
          extractedText, // Store the extracted text
        },
      },
    },
    { new: true, runValidators: true }
  ).lean();

  return res.status(200).json({
    success: true,
    data: updatedUser,
    message: 'Resume updated successfully',
  });
};
