import { Attendance } from '../models/attendence.model.js';
import { Student } from '../models/student.model.js';

export const markAbsentStudents = async (sessionId) => {
  try {
    const allStudents = await Student.find({});
    if (allStudents.length === 0) {
      console.log('No students found in the database. No absences to mark.');
      return;
    }

    let absentCount = 0; // To track how many were marked absent

    for (const student of allStudents) {
      // Check if the student already has an attendance record
      const record = await Attendance.findOne({
        student: student._id,
        classSession: sessionId,
      });

      // If no record exists, mark as absent
      if (!record) {
        await Attendance.create({
          student: student._id,
          classSession: sessionId,
          status: 'absent',
        });
        absentCount++;
      }
    }

    console.log(
      absentCount > 0
        ? `${absentCount} students marked as absent for session ${sessionId}`
        : `All students already have attendance records for session ${sessionId}`
    );
  } catch (error) {
    console.error(
      `Error marking absent students for session ${sessionId}:`,
      error
    );
  }
};

export default markAbsentStudents;
