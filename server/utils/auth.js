const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ context }, next) {
    const token = context.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      throw new Error('You have no token.');
    }

    const tokenValue = token.split(' ').pop().trim();

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(tokenValue, secret, { maxAge: expiration });
      context.user = data;
    } catch {
      throw new Error('Invalid token');
    }

    // send to next endpoint
    return next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
