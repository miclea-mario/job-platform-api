import { error } from '@functions';
import { User } from '@models';
import pick from 'lodash/pick';

export default async (req, res) => {
  const { me } = req.user;

  if (!me) {
    throw error(401, 'You must be logged in to update your profile');
  }

  const allowedFields = [
    'title',
    'bio',
    'skills',
    'phone',
    'location',
    'resume',
    'experience',
    'education',
    'jobPreferences',
  ];

  // Extract only the allowed fields from the request body
  const updateData = pick(req.body, allowedFields);

  try {
    // Find and update the user profile
    const updatedUser = await User.findByIdAndUpdate(
      me,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      throw error(404, 'User not found');
    }

    // Return the updated user data
    return res.status(200).json({
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw error(400, err.message);
    }
    throw err;
  }
};
