const mongoose = require('mongoose');

const ambulanceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emergencyType: {
    type: String,
    required: true,
    enum: ['cardiac', 'breathing', 'injury', 'allergic', 'stroke', 'other']
  },
  patientDetails: {
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    consciousness: {
      type: String,
      enum: ['conscious', 'unconscious', 'semiconscious'],
      default: 'conscious'
    },
    breathing: {
      type: String,
      enum: ['normal', 'difficult', 'not_breathing'],
      default: 'normal'
    },
    bleeding: {
      type: String,
      enum: ['no', 'minor', 'severe'],
      default: 'no'
    },
    additionalInfo: {
      type: String,
      default: ''
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'dispatched', 'arrived', 'completed', 'cancelled'],
    default: 'pending'
  },
  estimatedTime: {
    type: Number, // in minutes
    default: null
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AmbulanceProvider',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
ambulanceRequestSchema.index({ location: '2dsphere' });

const AmbulanceRequest = mongoose.model('AmbulanceRequest', ambulanceRequestSchema);

module.exports = AmbulanceRequest; 