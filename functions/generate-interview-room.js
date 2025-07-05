const axios = require('axios');
const jwt = require('jsonwebtoken');
const { Application, Interview } = require('@models');
const { default: randomHash } = require('./random-hash');

/**
 * Generates a new interview room using the 100ms API
 * @param {Object} application - The job application object containing information about the interview
 * @returns {Object} - Room details including roomId, roomCode, and managementToken
 */
const generateInterviewRoom = async (application, interviewDetails) => {
  try {
    // Prepare user data for room name and description
    const companyName = application.job?.company?.name;
    const userName = application.user?.name;
    const jobTitle = application.job?.title;

    // Create a unique name for the room
    const roomName = `interview-${randomHash()}`;
    const roomDescription = `Interview for ${jobTitle} between ${companyName} and ${userName}`;

    // Create management token using JWT
    const managementToken = jwt.sign(
      {
        access_key: process.env.HMS_ACCESS_KEY,
        type: 'management',
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
      },
      process.env.HMS_SECRET_KEY,
      {
        algorithm: 'HS256',
        expiresIn: '24h', // Token valid for 24 hours
        jwtid: randomHash(),
      }
    );

    // Create room using 100ms API
    const roomResponse = await axios.post(
      'https://api.100ms.live/v2/rooms',
      {
        name: roomName,
        description: roomDescription,
        template_id: process.env.HMS_TEMPLATE_ID,
        region: 'eu',
        max_duration_seconds: 3600, // 1 hour
      },
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    await Interview.deleteMany({ application: application._id });

    const interview = await Interview.create({
      roomId: roomResponse.data.id,
      application: application._id,
      ...interviewDetails,
    });

    await Application.findByIdAndUpdate(
      application._id,
      {
        interview,
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error creating interview room:', error.response?.data || error.message);
  }
};

module.exports = generateInterviewRoom;
