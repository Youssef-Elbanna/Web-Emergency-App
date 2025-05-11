const mongoose = require('mongoose');

const doctorConsultationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Doctor is a user with role='doctor'
    default: null
  },
  symptoms: {
    type: String,
    required: true
  },
  medicalHistory: {
    type: String,
    default: ''
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'doctor'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }],
    notes: String,
    timestamp: {
      type: Date,
      default: null
    }
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

const DoctorConsultation = mongoose.model('DoctorConsultation', doctorConsultationSchema);

module.exports = DoctorConsultation; 