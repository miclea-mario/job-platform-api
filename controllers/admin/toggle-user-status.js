import { error } from '@functions';
import { Identity } from '@models';

export default async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw error(400, 'User ID is required');
  }

  const user = await Identity.findById(id);
  if (!user) {
    throw error(404, 'User not found');
  }

  // Prevent admins from deactivating themselves
  if (user._id.toString() === req.user._id.toString()) {
    throw error(400, 'You cannot change your own status');
  }

  // Toggle the active status
  user.active = !user.active;
  await user.save();

  return res.status(200).json({
    message: `User ${user.active ? 'activated' : 'deactivated'} successfully`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    },
  });
};
