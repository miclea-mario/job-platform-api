const { error, generateInterviewRoom } = require('@functions');
const { Application } = require('@models');
const { APPLICATION_STATUS } = require('constants/application');

module.exports = async (req, res) => {
  const { me } = req.user;
  const { id } = req.params;
  const { status } = req.body;

  if (!Object.values(APPLICATION_STATUS).includes(status)) {
    throw error('Invalid status');
  }

  // First, find and update the application with the provided data
  let application = await Application.findOneAndUpdate(
    { _id: id, company: me },
    { ...req.body },
    { new: true } // Return the updated document
  );

  // If the status is for interview, generate the interview room
  if (status === APPLICATION_STATUS.PENDING_INTERVIEW) {
    await generateInterviewRoom(application);
  }

  return res.status(200).json({ message: 'Application updated', application });
};
