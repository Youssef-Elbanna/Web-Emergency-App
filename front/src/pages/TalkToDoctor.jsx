import { useState } from 'react';
import './TalkToDoctor.css';

function TalkToDoctor() {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [symptomInfo, setSymptomInfo] = useState({
    symptoms: '',
    duration: '',
    severity: 'mild',
    previousTreatment: '',
    medicalHistory: '',
    medications: '',
    allergies: ''
  });
  const [preferredContactMethod, setPreferredContactMethod] = useState('video');
  const [consultationRequested, setConsultationRequested] = useState(false);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(null);
  
  const specialties = [
    { id: 'general', name: 'General Physician', icon: '👨‍⚕️' },
    { id: 'emergency', name: 'Emergency Medicine', icon: '🚨' },
    { id: 'pediatric', name: 'Pediatrician', icon: '👶' },
    { id: 'cardiology', name: 'Cardiologist', icon: '❤️' },
    { id: 'neurology', name: 'Neurologist', icon: '🧠' },
    { id: 'dermatology', name: 'Dermatologist', icon: '🧬' },
    { id: 'orthopedic', name: 'Orthopedic', icon: '🦴' },
    { id: 'gynecology', name: 'Gynecologist', icon: '👩‍⚕️' }
  ];
  
  const handleSpecialtySelect = (specialty) => {
    setSelectedSpecialty(specialty);
    setStep(2);
  };
  
  const handleSymptomInfoChange = (e) => {
    const { name, value } = e.target;
    setSymptomInfo({
      ...symptomInfo,
      [name]: value
    });
  };
  
  const handleSubmitSymptomInfo = (e) => {
    e.preventDefault();
    setStep(3);
  };
  
  const handleContactMethodChange = (method) => {
    setPreferredContactMethod(method);
  };
  
  const handleRequestConsultation = () => {
    // In a real app, this would send the request to a backend
    setConsultationRequested(true);
    // Simulate a random wait time between 2 and 20 minutes
    setEstimatedWaitTime(Math.floor(Math.random() * 19) + 2);
  };
  
  const handleNewConsultation = () => {
    setStep(1);
    setSelectedSpecialty('');
    setSymptomInfo({
      symptoms: '',
      duration: '',
      severity: 'mild',
      previousTreatment: '',
      medicalHistory: '',
      medications: '',
      allergies: ''
    });
    setPreferredContactMethod('video');
    setConsultationRequested(false);
    setEstimatedWaitTime(null);
  };
  
  return (
    <div className="talk-to-doctor-container">
      <h1>Talk to a Doctor</h1>
      
      {consultationRequested ? (
        <div className="consultation-requested">
          <div className="consultation-icon">👨‍⚕️</div>
          <h2>Consultation Request Submitted</h2>
          <p>A {selectedSpecialty ? specialties.find(s => s.id === selectedSpecialty)?.name : 'doctor'} will contact you shortly via {preferredContactMethod}.</p>
          
          <div className="wait-time">
            <h3>Estimated Wait Time: <span>{estimatedWaitTime} minutes</span></h3>
          </div>
          
          <div className="consultation-info">
            <h3>Your Consultation Details:</h3>
            <div className="info-item">
              <span className="info-label">Specialty:</span>
              <span className="info-value">{selectedSpecialty ? specialties.find(s => s.id === selectedSpecialty)?.name : 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Contact Method:</span>
              <span className="info-value">{preferredContactMethod === 'video' ? 'Video Call' : preferredContactMethod === 'audio' ? 'Audio Call' : 'Chat'}</span>
            </div>
          </div>
          
          <div className="preparation-tips">
            <h3>While You Wait:</h3>
            <ul>
              <li>Find a quiet place with good internet connection</li>
              <li>Have your medical information ready</li>
              <li>Write down any questions you want to ask</li>
              <li>Keep your phone or device charged</li>
            </ul>
          </div>
          
          <button className="new-consultation-btn" onClick={handleNewConsultation}>Request Another Consultation</button>
        </div>
      ) : (
        <>
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Specialty</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Symptoms</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Contact</div>
          </div>
          
          {step === 1 && (
            <div className="specialty-container">
              <h2>Select Medical Specialty</h2>
              <p className="specialty-instruction">Choose the most appropriate specialty for your medical concern</p>
              
              <div className="specialties-grid">
                {specialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    className={`specialty-card ${selectedSpecialty === specialty.id ? 'selected' : ''}`}
                    onClick={() => handleSpecialtySelect(specialty.id)}
                  >
                    <div className="specialty-icon">{specialty.icon}</div>
                    <div className="specialty-name">{specialty.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="symptom-container">
              <h2>Describe Your Symptoms</h2>
              <p className="symptom-instruction">Provide details about your medical concern to help the doctor understand your condition better</p>
              
              <form onSubmit={handleSubmitSymptomInfo} className="symptom-form">
                <div className="form-group">
                  <label htmlFor="symptoms">Symptoms*</label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    value={symptomInfo.symptoms}
                    onChange={handleSymptomInfoChange}
                    placeholder="Describe your symptoms in detail"
                    required
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="duration">Duration of Symptoms</label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={symptomInfo.duration}
                      onChange={handleSymptomInfoChange}
                      placeholder="e.g. 3 days, 1 week"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="severity">Severity</label>
                    <select
                      id="severity"
                      name="severity"
                      value={symptomInfo.severity}
                      onChange={handleSymptomInfoChange}
                    >
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="previousTreatment">Previous Treatment (if any)</label>
                  <textarea
                    id="previousTreatment"
                    name="previousTreatment"
                    value={symptomInfo.previousTreatment}
                    onChange={handleSymptomInfoChange}
                    placeholder="Any medications or treatments you've tried"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="medicalHistory">Relevant Medical History</label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={symptomInfo.medicalHistory}
                    onChange={handleSymptomInfoChange}
                    placeholder="Any pre-existing conditions"
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="medications">Current Medications</label>
                    <textarea
                      id="medications"
                      name="medications"
                      value={symptomInfo.medications}
                      onChange={handleSymptomInfoChange}
                      placeholder="List any medications you're taking"
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="allergies">Allergies</label>
                    <textarea
                      id="allergies"
                      name="allergies"
                      value={symptomInfo.allergies}
                      onChange={handleSymptomInfoChange}
                      placeholder="Any known allergies"
                    ></textarea>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="back-btn" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" className="next-btn">Next</button>
                </div>
              </form>
            </div>
          )}
          
          {step === 3 && (
            <div className="contact-method-container">
              <h2>Choose Contact Method</h2>
              <p className="contact-instruction">Select how you'd like the doctor to contact you</p>
              
              <div className="contact-methods">
                <button
                  className={`contact-method-card ${preferredContactMethod === 'video' ? 'selected' : ''}`}
                  onClick={() => handleContactMethodChange('video')}
                >
                  <div className="contact-icon">📹</div>
                  <div className="contact-label">Video Call</div>
                  <p className="contact-description">Face-to-face consultation with the doctor</p>
                </button>
                
                <button
                  className={`contact-method-card ${preferredContactMethod === 'audio' ? 'selected' : ''}`}
                  onClick={() => handleContactMethodChange('audio')}
                >
                  <div className="contact-icon">📞</div>
                  <div className="contact-label">Audio Call</div>
                  <p className="contact-description">Voice-only consultation with the doctor</p>
                </button>
                
                <button
                  className={`contact-method-card ${preferredContactMethod === 'chat' ? 'selected' : ''}`}
                  onClick={() => handleContactMethodChange('chat')}
                >
                  <div className="contact-icon">💬</div>
                  <div className="contact-label">Chat</div>
                  <p className="contact-description">Text-based consultation with the doctor</p>
                </button>
              </div>
              
              <div className="contact-note">
                <p>Note: You'll receive a notification when the doctor is ready to connect. Make sure your device has the necessary permissions for your chosen contact method.</p>
              </div>
              
              <div className="form-actions">
                <button type="button" className="back-btn" onClick={() => setStep(2)}>Back</button>
                <button type="button" className="request-btn" onClick={handleRequestConsultation}>
                  Request Consultation
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TalkToDoctor; 