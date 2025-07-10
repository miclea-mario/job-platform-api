import { error, getInterviewRoom, randomHash } from '@functions';
import { Identity, Interview } from '@models';
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

  const [identity, interview] = await Promise.all([
    Identity.findById(me).select('role name avatar').lean(),
    Interview.findOne({ application: applicationId }).lean(),
  ]);

  const payload = {
    access_key: process.env.HMS_ACCESS_KEY,
    room_id: interview.roomId,
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

  const room = await getInterviewRoom(applicationId);

  return res.status(200).json({ interview, user: identity, token, room });
};
