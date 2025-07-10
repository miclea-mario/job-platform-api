const axios = require('axios');
const jwt = require('jsonwebtoken');
const { Interview } = require('@models');
const { default: randomHash } = require('./random-hash');

/**
 * Get an interview room using the 100ms API
 * @param {string} applicationId - The job application ID
 * @returns {Object} - Room details
 */
const getInterviewRoom = async (applicationId) => {
  try {
    const interview = await Interview.findOne({ application: applicationId }).lean();

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
    const roomResponse = await axios.get(`https://api.100ms.live/v2/rooms/${interview.roomId}`, {
      headers: {
        Authorization: `Bearer ${managementToken}`,
        'Content-Type': 'application/json',
      },
    });

    return roomResponse.data;
  } catch (error) {
    console.error('Error getting interview room:', error.response?.data || error.message);
  }
};

module.exports = getInterviewRoom;
