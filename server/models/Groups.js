import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  }]
}, { timestamps: true });

export default mongoose.model('Group', GroupSchema);
