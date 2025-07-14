import { error, generateAIProfileExtraction } from '@functions';
import { User } from '@models';
import { isEmpty } from 'lodash';

export default async (req, res) => {
  const { me } = req.user;

  const user = await User.findById(me);

  if (!user) {
    throw error(404, 'User not found');
  }

  if (!user.resume || !user.resume.extractedText) {
    throw error(400, 'No resume text available for extraction. Please upload a resume first.');
  }

  // Extract profile data using AI
  let aiExtractedData = {};
  try {
    aiExtractedData = await generateAIProfileExtraction(user.resume.extractedText);
  } catch (err) {
    console.error('Error extracting profile data with AI:', err);
    throw error(500, 'Failed to extract profile data from resume');
  }

  if (isEmpty(aiExtractedData)) {
    throw error(400, 'No profile data could be extracted from the resume');
  }

  // Build update object for user profile
  // Only update profile fields if they are currently empty/missing
  const updateData = {};
  const updatedFields = [];

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

  if (isEmpty(updateData)) {
    return res.status(200).json({
      success: true,
      message: 'No new profile data extracted - all fields already filled',
      extractedData: aiExtractedData,
      updatedFields: [],
    });
  }

  // Update user with AI-extracted profile data
  const updatedUser = await User.findByIdAndUpdate(
    me,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  return res.status(200).json({
    success: true,
    data: updatedUser,
    message: `Profile updated with AI-extracted data in ${updatedFields.length} field(s)`,
    extractedData: aiExtractedData,
    updatedFields,
  });
};
