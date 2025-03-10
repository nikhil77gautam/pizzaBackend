import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'abcd');

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token verification failed' });
  }
};

export default protect;
