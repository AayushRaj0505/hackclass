const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Unauthorized: Access token missing or invalid header format');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 401, 'Unauthorized: Access token missing');
    }

    const secret = process.env.JWT_SECRET || 'default_jwt_secret_fallback';
    const decoded = jwt.verify(token, secret);

    // Attach user information to request object
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Unauthorized: Authentication token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Unauthorized: Invalid authentication token');
    }
    return sendError(res, 401, 'Unauthorized: Authentication failed');
  }
};

module.exports = authMiddleware;
