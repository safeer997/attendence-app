import mongoose, { Schema } from 'mongoose';

const attendanceSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    classSession: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSession',
      required: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'absent'], // Three statuses
      required: true,
    },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model('Attendance', attendanceSchema);
