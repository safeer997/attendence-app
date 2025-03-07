import { Attendance } from '../models/attendence.model.js';
import { ClassSession } from '../models/classSession.model.js';
import { Student } from '../models/student.model.js';

const markAttendance = async (req, res) => {
  const { phoneNumber } = req.body;
  const studentIp = req.ip;
  const sessionId = req.params;

  //validate session id
  if (!sessionId?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'session id is required',
    });
  }

  //validate phone number
  if (!phoneNumber?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'phone number is required for marking the attendance',
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
    const student = await Student.findOne({ phoneNumber });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'invalid phoneNumber',
      });
    }

    //checking attendance if already marked
    const attendanceExists = await Attendance.findOne({
      student: student._id,
      classSession: session._id,
    });

    if (attendanceExists) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this session',
      });
    }

    //marking attendance for offline and online students

    //1 for offline students
    const accioCenterIpAddress = process.env.ACCIO_IP;

    if (studentIp === accioCenterIpAddress) {
      //mark attendance
      const attendance = await Attendance.create({
        student: student._id,
        classSession: session._id,
        status: 'offline',
      });

      if (!attendance) {
        return res.status(500).json({
          success: false,
          message: 'error in marking attendance in mongo db',
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Attendance marked successfully for student',
        data: student,
      });
    }

    //2 checking online students and marking their attendance
    const onlineStudent = session.onlineStudents?.find(
      (s) => s.phoneNumber === phoneNumber
    );

    if (!onlineStudent) {
      return res.status(400).json({
        success: false,
        message: 'student was not present online for this session',
      });
    }

    const attendance = await Attendance.create({
      student: student._id,
      classSession: session._id,
      status: 'online',
    });

    if (!attendance) {
      return res.status(500).json({
        success: false,
        message: 'error in marking online attendance in mongo db',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Attendance marked successfully for online present student',
      data: student,
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({
      success: false,
      message: 'something went wrong',
    });
  }
};

export { markAttendance };
