import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const tokenVerify = (req, res, next) => {
  try {
    let accessToken = req.cookies?.EUAT;
    const refreshToken = req.cookies?.EURT;

    if (!accessToken) {
      const authHeader = req.headers?.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
      }
    }

    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (!err) {
        if (!decoded || decoded.id === undefined || decoded.email === undefined) {
          return res.status(401).json({ error: 'Invalid Access Token payload' });
        }
        req.user = decoded;
        req.userId = decoded.id;
        return next();
      }

      if (err.name !== 'TokenExpiredError') {
        return res.status(401).json({ error: 'Invalid Access Token' });
      }

      res.clearCookie('EUAT');

      if (!refreshToken) {
        return res.status(401).json({ error: 'Missing Refresh Token' });
      }

      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (rErr, rDecoded) => {
        if (rErr) {
          res.clearCookie('EURT');
          return res.status(401).json({ error: 'Invalid Refresh Token' });
        }

        if (!rDecoded || rDecoded.id === undefined || rDecoded.email === undefined) {
          return res.status(401).json({ error: 'Invalid Refresh Token payload' });
        }

        const newAccessToken = jwt.sign(
          { id: rDecoded.id, email: rDecoded.email },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: '7d' }
        );

        res.cookie('EUAT', newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        req.user = { id: rDecoded.id, email: rDecoded.email };
        req.userId = rDecoded.id;
        return next();
      });
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default tokenVerify;


