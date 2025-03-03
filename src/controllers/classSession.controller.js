import { ClassSession } from '../models/classSession.model.js';
import { Instructor } from '../models/instructor.model.js';
import mongoose from 'mongoose';

//function to generate attendence link :
const generateAttendanceLink = (topic, sessionDate) => {
  const formattedDate = new Date(sessionDate).toISOString().split('T')[0]; // YYYY-MM-DD
  const formattedTopic = topic.replace(/\s+/g, '-'); // Replace spaces with dashes
  const randomString = Math.random().toString(36).substring(2, 8); // Generate random string

  return `https://yourapp.com/attendance/${formattedDate}-${formattedTopic}-${randomString}`;
};

//--------------------------------------------------------------------------------------------------

const createSession = async (req, res) => {
  const { topic, instructorId, sessionDate } = req.body;
  try {
    if (!topic || !instructorId || !sessionDate) {
      return res.status(400).json({
        success: false,
        message: 'topic , instructor id and session date is required !',
      });
    }

    //validating topic
    if (typeof topic !== 'string' || topic.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Topic must be a non-empty string.',
      });
    }

    //validating instructor id

    const instructor = await Instructor.findById(instructorId);

    if (!instructor) {
      return res.status(400).json({
        success: false,
        message: 'Invalid instructorId.',
      });
    }

    //validating date
    const date = new Date(sessionDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sessionDate format.',
      });
    }

    //attendence link

    const attendenceLink = generateAttendanceLink(topic, sessionDate);

    const session = await ClassSession.create({
      topic,
      instructor: instructorId,
      sessionDate: sessionDate,
      attendanceLink: attendenceLink,
    });

    const createdSession = await ClassSession.findById(session._id).populate(
      'instructor'
    );

    if (!createdSession) {
      return res.status(500).json({
        success: false,
        message: 'error creating session in database',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'class session successfully created',
      data: createdSession,
    });
  } catch (error) {
    console.log('Error :', error);
    res.status(500).json({
      success: false,
      message: 'something went wrong',
    });
  }
};

//  GET ALL SESSIONS

const getAllSessions = async (req, res) => {
  try {
    const sessions = await ClassSession.find().populate('instructor');
    if (sessions.length === 0) {
      {
        return res.status(400).json({
          success: false,
          message: 'no session record exists',
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'class sessions data fetched successfully',
      data: sessions,
    });
  } catch (error) {
    console.log('Error :', error);
    res.status(500).json({
      success: false,
      message: 'something went wrong',
    });
  }
};

// GET A INDIVIVDUAL SESSION

const getSession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await ClassSession.findById(sessionId).populate(
      'instructor'
    );
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'session not found',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'session data fetched successfully',
      data: session,
    });
  } catch (error) {
    console.log('Error :', error);
    res.status(500).json({
      success: false,
      message: 'something went wrong',
    });
  }
};

export { createSession, getSession, getAllSessions };
