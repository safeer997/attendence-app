import { ClassSession } from '../models/classSession.model.js';
import { Instructor } from '../models/instructor.model.js';
import markAbsentStudents from '../services/update.attendence.js';

// Function to generate attendance link
const generateAttendanceLink = (sessionId) => {
  return `https://yourapp.com/attendance/${sessionId}`;
};

//--------------------------------------------------------------------------------------------------

const createSession = async (req, res) => {
  const { topic, instructorId, sessionDate } = req.body;
  try {
    if (!topic || !instructorId || !sessionDate) {
      return res.status(400).json({
        success: false,
        message: 'topic , instructor id ,session date is required !',
      });
    }

    // Validating topic
    if (typeof topic !== 'string' || topic.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Topic must be a non-empty string.',
      });
    }

    // Validating instructor ID
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(400).json({
        success: false,
        message: 'Invalid instructorId.',
      });
    }

    // Validating date
    const date = new Date(sessionDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sessionDate format.',
      });
    }

    // Creating session (without attendance link first)
    const session = await ClassSession.create({
      topic,
      instructor: instructorId,
      sessionDate: sessionDate,
    });

    // Generating attendance link
    const attendanceLink = generateAttendanceLink(session._id);

    // Updating session with the attendance link
    session.attendanceLink = attendanceLink;
    await session.save();

    // Fetching the created session with instructor details
    const createdSession = await ClassSession.findById(session._id).populate(
      'instructor'
    );

    if (!createdSession) {
      return res.status(500).json({
        success: false,
        message: 'Error creating session in database',
      });
    }

    // Run automated attendance marking function
    setTimeout(() => {
      markAbsentStudents(session._id);
    }, 60 * 60 * 1000);

    //--------------------------------------------------------

    return res.status(201).json({
      success: true,
      message: 'Class session successfully created',
      data: createdSession,
    });
  } catch (error) {
    console.log('Error :', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

// GET ALL SESSIONS
const getAllSessions = async (req, res) => {
  try {
    const sessions = await ClassSession.find().populate('instructor');
    if (sessions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No session record exists',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Class sessions data fetched successfully',
      data: sessions,
    });
  } catch (error) {
    console.log('Error :', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

// GET AN INDIVIDUAL SESSION
const getSession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await ClassSession.findById(sessionId).populate(
      'instructor'
    );
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Session data fetched successfully',
      data: session,
    });
  } catch (error) {
    console.log('Error :', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export { createSession, getSession, getAllSessions };
