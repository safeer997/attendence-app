import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const studentSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // macAddress: {
    //   type: String,
    //   unique: true,
    //   sparse: true,
    // },
    batch: {
      type: String,
    },
  },
  { timestamps: true }
);

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const Student = mongoose.model('Student', studentSchema);
