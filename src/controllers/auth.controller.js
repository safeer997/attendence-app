import { Instructor } from '../models/instructor.model.js';
import { Student } from '../models/student.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    let user = await Student.findOne({
      phoneNumber,
    });
    let role = 'student';

    if (!user) {
      user = await Instructor.findOne({
        phoneNumber,
      });
      role = 'instructor';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized to login',
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      role,
    });
  } catch (error) {
    console.log('Error in login:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.log('Error in logout:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export { login, logout };
