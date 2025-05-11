const DoctorConsultation = require('../models/DoctorConsultation');
const User = require('../models/User');

// @desc    Create a new doctor consultation request
// @route   POST /api/doctors/consultation
// @access  Private
exports.createConsultation = async (req, res) => {
  try {
    const { symptoms, medicalHistory, urgency } = req.body;

    // Validate required fields
    if (!symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Please provide symptoms'
      });
    }

    // Create consultation
    const consultation = await DoctorConsultation.create({
      user: req.user._id,
      symptoms,
      medicalHistory: medicalHistory || '',
      urgency: urgency || 'medium'
    });

    // In a real app, this would notify available doctors
    res.status(201).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user consultations
// @route   GET /api/doctors/consultations
// @access  Private
exports.getUserConsultations = async (req, res) => {
  try {
    const consultations = await DoctorConsultation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('doctor', 'fullName'); // Get doctor's name if assigned

    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get consultation by ID
// @route   GET /api/doctors/consultations/:id
// @access  Private
exports.getConsultation = async (req, res) => {
  try {
    const consultation = await DoctorConsultation.findById(req.params.id)
      .populate('doctor', 'fullName');

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Check if the consultation belongs to the user or if the user is the assigned doctor
    if (consultation.user.toString() !== req.user._id.toString() && 
        (req.user.role !== 'doctor' || 
        (!consultation.doctor || consultation.doctor._id.toString() !== req.user._id.toString())) && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this consultation'
      });
    }

    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Add message to consultation
// @route   POST /api/doctors/consultations/:id/messages
// @access  Private
exports.addMessage = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide message content'
      });
    }

    const consultation = await DoctorConsultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Determine if the user can add a message
    let canAddMessage = false;
    let sender = '';

    if (consultation.user.toString() === req.user._id.toString()) {
      canAddMessage = true;
      sender = 'user';
    } else if (req.user.role === 'doctor' && 
               (consultation.doctor?.toString() === req.user._id.toString() || 
               consultation.status === 'pending')) {
      // If doctor is assigned or consultation is pending (doctor can claim it)
      canAddMessage = true;
      sender = 'doctor';
      
      // If doctor is not yet assigned, assign them
      if (!consultation.doctor) {
        consultation.doctor = req.user._id;
        consultation.status = 'active';
      }
    }

    if (!canAddMessage) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add messages to this consultation'
      });
    }

    // Add message
    consultation.messages.push({
      sender,
      content,
      timestamp: Date.now(),
      isRead: false
    });

    consultation.updatedAt = Date.now();
    await consultation.save();

    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Add prescription to consultation
// @route   POST /api/doctors/consultations/:id/prescription
// @access  Private (Doctor only)
exports.addPrescription = async (req, res) => {
  try {
    const { medications, notes } = req.body;

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one medication'
      });
    }

    const consultation = await DoctorConsultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Only the assigned doctor can add a prescription
    if (req.user.role !== 'doctor' || 
        !consultation.doctor || 
        consultation.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add a prescription to this consultation'
      });
    }

    // Add prescription
    consultation.prescription = {
      medications,
      notes: notes || '',
      timestamp: Date.now()
    };

    consultation.updatedAt = Date.now();
    await consultation.save();

    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Complete consultation
// @route   PUT /api/doctors/consultations/:id/complete
// @access  Private (Doctor only)
exports.completeConsultation = async (req, res) => {
  try {
    const consultation = await DoctorConsultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Only the assigned doctor can complete the consultation
    if (req.user.role !== 'doctor' || 
        !consultation.doctor || 
        consultation.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this consultation'
      });
    }

    consultation.status = 'completed';
    consultation.updatedAt = Date.now();
    await consultation.save();

    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all available doctors
// @route   GET /api/doctors
// @access  Private
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('fullName');

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 