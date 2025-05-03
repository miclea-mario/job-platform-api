import { error, randomHash } from '@functions';
import { Application, Identity } from '@models';
const jwt = require('jsonwebtoken');

export default async (req, res) => {
  const { me } = req.user;
  const { applicationId } = req.params;

  if (!me) {
    throw error(404, 'Missing required params');
  }
  if (!applicationId) {
    throw error(404, 'Missing required params');
  }

  const [identity, application] = await Promise.all([
    Identity.findById(me).select('role name avatar').lean(),
    Application.findById(applicationId).select('interviewDetails').lean(),
  ]);

  const payload = {
    access_key: process.env.HMS_ACCESS_KEY,
    room_id: application.interviewDetails.roomId,
    user_id: me,
    role: identity.role,
    type: 'app',
    version: 2,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, process.env.HMS_SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '24h',
    jwtid: randomHash(),
  });

  return res.status(200).json({ application, user: identity, token });
};
