const express = require('express');
const { 
  createConsultation, 
  getUserConsultations, 
  getConsultation, 
  addMessage, 
  addPrescription, 
  completeConsultation,
  getDoctors
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes below require authentication
router.use(protect);

// Get all doctors
router.get('/', getDoctors);

// Consultation routes
router.post('/consultation', createConsultation);
router.get('/consultations', getUserConsultations);
router.get('/consultations/:id', getConsultation);
router.post('/consultations/:id/messages', addMessage);

// Doctor-only routes
router.post('/consultations/:id/prescription', authorize('doctor'), addPrescription);
router.put('/consultations/:id/complete', authorize('doctor'), completeConsultation);

module.exports = router; 