import { Attendance } from '../models/attendence.model.js';
import { ClassSession } from '../models/classSession.model.js';
import { Student } from '../models/student.model.js';

const markAttendence = async (req, res) => {
  const { sessionId, phoneNumber } = req.body;
  const studentIp = req.ip;

  //validate session id
  if (sessionId.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'session id is required',
    });
  }

  if (phoneNumber.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'phone number is required for marking the attendence',
    });
  }

  try {
    //checking session
    const session = await ClassSession.findById(sessionId);
    if (!session) {
      return res.status(400).json({
        success: false,
        message: 'invalid session id',
      });
    }

    //checking student

    const student = await Student.findOne({ phoneNumber: phoneNumber });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'invalid phoneNumber',
      });
    }

    //checking attendence if already marked

    const attendance = await Attendance.findOne({
      student: student._id,
      classSession: session._id,
    });

    if (attendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this session',
      });
    }

    //marking attendence

    let status = 'absent';

     //matching ip of accio with student ip later we will put this into env file
    if (studentIp === 'AccioIp') {
      status = 'offline';
    }

    

    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'something went wrong',
    });
  }
};
