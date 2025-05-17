import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  members: [{
    userId: {
      type: String,
      ref: 'User'
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  statuses: {
    type: [String],
    default: ['To Do', 'In Progress', 'Review', 'Done'],
    validate: [
      {
        validator: function(arr) {
          return arr.length > 0;
        },
        message: 'Project must have at least one status'
      },
      {
        validator: function(arr) {
          return new Set(arr).size === arr.length;
        },
        message: 'All status names must be unique'
      }
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
