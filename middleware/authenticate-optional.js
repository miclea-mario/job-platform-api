const { verify } = require('jsonwebtoken');

const authenticateOptional = async (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const token = authorization.split(' ').reverse()[0];
  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next();
    }

    // Check for required fields in the JWT payload
    const { me, _id, email } = decoded;
    if (!email || (!me && !_id)) {
      return next();
    }

    // Make the decoded JWT payload available on the request object
    req.user = decoded;
    req.user._id = me; // alias

    next();
  });
};

module.exports = authenticateOptional;
