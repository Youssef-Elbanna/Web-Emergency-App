const AmbulanceRequest = require('../models/AmbulanceRequest');

// @desc    Create a new ambulance request
// @route   POST /api/ambulance/request
// @access  Private
exports.createAmbulanceRequest = async (req, res) => {
  try {
    const {
      emergencyType,
      patientDetails,
      location
    } = req.body;

    // Validate required fields
    if (!emergencyType || !patientDetails || !location || !location.coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create request
    const ambulanceRequest = await AmbulanceRequest.create({
      user: req.user._id,
      emergencyType,
      patientDetails,
      location
    });

    // In a real application, this would trigger a notification to ambulance providers
    // For demo purposes, let's simulate an estimated time
    const estimatedTime = Math.floor(Math.random() * 11) + 5; // 5-15 minutes
    ambulanceRequest.estimatedTime = estimatedTime;
    await ambulanceRequest.save();

    res.status(201).json({
      success: true,
      data: ambulanceRequest
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

// @desc    Get user's ambulance requests
// @route   GET /api/ambulance/requests
// @access  Private
exports.getUserAmbulanceRequests = async (req, res) => {
  try {
    const ambulanceRequests = await AmbulanceRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      count: ambulanceRequests.length,
      data: ambulanceRequests
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

// @desc    Get ambulance request by ID
// @route   GET /api/ambulance/requests/:id
// @access  Private
exports.getAmbulanceRequest = async (req, res) => {
  try {
    const ambulanceRequest = await AmbulanceRequest.findById(req.params.id);

    if (!ambulanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance request not found'
      });
    }

    // Check if the request belongs to the user or if the user is an admin
    if (ambulanceRequest.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this request'
      });
    }

    res.status(200).json({
      success: true,
      data: ambulanceRequest
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

// @desc    Update ambulance request status
// @route   PUT /api/ambulance/requests/:id/status
// @access  Private
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status'
      });
    }

    const ambulanceRequest = await AmbulanceRequest.findById(req.params.id);

    if (!ambulanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance request not found'
      });
    }

    // Only allow admin or the assigned ambulance provider to update the status
    if (req.user.role !== 'admin' && 
        (!ambulanceRequest.assignedTo || 
         ambulanceRequest.assignedTo.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    ambulanceRequest.status = status;
    ambulanceRequest.updatedAt = Date.now();
    await ambulanceRequest.save();

    res.status(200).json({
      success: true,
      data: ambulanceRequest
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

// @desc    Cancel ambulance request
// @route   PUT /api/ambulance/requests/:id/cancel
// @access  Private
exports.cancelRequest = async (req, res) => {
  try {
    const ambulanceRequest = await AmbulanceRequest.findById(req.params.id);

    if (!ambulanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance request not found'
      });
    }

    // Only the user who created the request can cancel it
    if (ambulanceRequest.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request'
      });
    }

    // Check if the request is already completed
    if (['completed', 'cancelled'].includes(ambulanceRequest.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request with status: ${ambulanceRequest.status}`
      });
    }

    ambulanceRequest.status = 'cancelled';
    ambulanceRequest.updatedAt = Date.now();
    await ambulanceRequest.save();

    res.status(200).json({
      success: true,
      data: ambulanceRequest
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