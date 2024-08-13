import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  Name: { 
    type: String,
    required: true,
    trim: true
  },
  dob: { 
    type: Date,
    required: true,
    trim:true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  yearOfjoining: { 
    type: Number, 
    required: true
  },
  interests: {
    type: [String], 
    required: true
  },
  hobbies: {
    type: [String], 
    required: true
  },
  currentAddress: {
    type: [String], 
    required: true
  },
  PermanentAddress: {
    type: [String], 
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Unique constraint
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema); // Use singular model name "User"
