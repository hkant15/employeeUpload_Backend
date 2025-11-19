import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { All_Models } from '../../Utils/All_Models.js';

dotenv.config();

const authController = {};

// authController.register = async (req, res) => {
//   try {
//     const {email,password} = req.body || {};

//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields (email, password) are required" });
//     }
//     const existingUser = await All_Models.Admin.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "Admin already exists with this email" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await All_Models.Admin.create({
//       email,
//       password: hashedPassword,
//     });

//     const adminSafe = { ...newUser.toJSON() };
//     delete adminSafe.password;

//     return res.status(201).json({ message: "Admin registered successfully", admin: adminSafe });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await All_Models.Admin.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const payload = { id: user.id, email: user.email };

    const accessTokenHRMS = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '7d' }
    );

    const refreshTokenHRMS = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    res.cookie(
      'EUAT',
      accessTokenHRMS,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
      }
    );

    res.cookie(
      'EURT',
      refreshTokenHRMS,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000
      }
    );

    const { password: _ignored, ...safeUser } = user.get({ plain: true });

    return res.status(200).json({
      message: 'User logged in successfully',
      user: safeUser,
      EUAT: accessTokenHRMS,
      EURT: refreshTokenHRMS
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

authController.logout = (req, res) => {
  try {
    res.clearCookie('EUAT');
    res.clearCookie('EURT');
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export default authController;

