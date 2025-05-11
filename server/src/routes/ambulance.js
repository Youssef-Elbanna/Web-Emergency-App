const express = require('express');
const { 
  createAmbulanceRequest, 
  getUserAmbulanceRequests, 
  getAmbulanceRequest, 
  updateRequestStatus, 
  cancelRequest 
} = require('../controllers/ambulanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes below require authentication
router.use(protect);

// User routes
router.post('/request', createAmbulanceRequest);
router.get('/requests', getUserAmbulanceRequests);
router.get('/requests/:id', getAmbulanceRequest);
router.put('/requests/:id/cancel', cancelRequest);

// Admin/Ambulance Provider routes
router.put('/requests/:id/status', authorize('admin'), updateRequestStatus);

module.exports = router; 