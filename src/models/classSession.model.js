import mongoose, { Schema } from 'mongoose';

const classSessionSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    attendanceLink: {
      type: String,
    },
    // zoomMeetingId: {
    //   type: String,
    // },
    onlineStudents: [
      {
        name: String,
        phoneNumber: String,
      },
    ],
  },
  { timestamps: true }
);

export const ClassSession = mongoose.model('ClassSession', classSessionSchema);
