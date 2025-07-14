import { error, generateAIProfileExtraction } from '@functions';
import { User } from '@models';
import aws from '@plugins/aws/src';
import { isEmpty } from 'lodash';
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

  // Extract profile data using AI if we have text and user profile is not complete
  let aiExtractedData = {};
  let aiExtractionError = null;

  if (extractedText && extractedText.length > 100) {
    try {
      aiExtractedData = await generateAIProfileExtraction(extractedText);
    } catch (err) {
      console.error('Error extracting profile data with AI:', err);
      aiExtractionError = err.message;
      // Continue without AI extraction if it fails
    }
  }

  // Build update object for user profile
  const updateData = {
    resume: {
      url: resumeUrl,
      fileName: resume.name,
      updatedAt: new Date(),
      extractedText,
    },
  };

  // Track which fields were updated by AI
  const updatedFields = [];

  // Only update profile fields if they are currently empty/missing
  // This ensures we don't overwrite existing user data
  if (aiExtractedData.title && !user.title) {
    updateData.title = aiExtractedData.title;
    updatedFields.push('title');
  }

  if (aiExtractedData.bio && !user.bio) {
    updateData.bio = aiExtractedData.bio;
    updatedFields.push('bio');
  }

  if (aiExtractedData.skills && !isEmpty(aiExtractedData.skills) && isEmpty(user.skills)) {
    updateData.skills = aiExtractedData.skills;
    updatedFields.push('skills');
  }

  if (aiExtractedData.experience && !isEmpty(aiExtractedData.experience) && isEmpty(user.experience)) {
    updateData.experience = aiExtractedData.experience;
    updatedFields.push('experience');
  }

  if (aiExtractedData.education && !isEmpty(aiExtractedData.education) && isEmpty(user.education)) {
    updateData.education = aiExtractedData.education;
    updatedFields.push('education');
  }

  if (aiExtractedData.phone && !user.phone) {
    updateData.phone = aiExtractedData.phone;
    updatedFields.push('phone');
  }

  if (aiExtractedData.location && !user.location) {
    updateData.location = aiExtractedData.location;
    updatedFields.push('location');
  }

  // Update user with new resume information and AI-extracted profile data
  const updatedUser = await User.findByIdAndUpdate(
    me,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  return res.status(200).json({
    success: true,
    data: updatedUser,
    message: 'Resume updated successfully',
    aiExtracted: !isEmpty(aiExtractedData),
    extractedFields: updatedFields,
    aiExtractionError,
  });
};
