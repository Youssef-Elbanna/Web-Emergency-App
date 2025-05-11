import { useState } from 'react';
import MapComponent from '../components/MapComponent';
import './RequestAmbulance.css';

function RequestAmbulance() {
  const [step, setStep] = useState(1);
  const [emergencyType, setEmergencyType] = useState('');
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    gender: '',
    consciousness: 'conscious',
    breathing: 'normal',
    bleeding: 'no',
    additionalInfo: ''
  });
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(null);
  
  const emergencyTypes = [
    { id: 'cardiac', label: 'Cardiac Emergency', icon: '❤️' },
    { id: 'breathing', label: 'Breathing Difficulty', icon: '🫁' },
    { id: 'injury', label: 'Severe Injury/Bleeding', icon: '🩸' },
    { id: 'allergic', label: 'Allergic Reaction', icon: '⚠️' },
    { id: 'stroke', label: 'Possible Stroke', icon: '🧠' },
    { id: 'other', label: 'Other Emergency', icon: '🚑' }
  ];
  
  const handleEmergencyTypeSelect = (type) => {
    setEmergencyType(type);
    setStep(2);
  };
  
  const handlePatientDetailChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({
      ...patientDetails,
      [name]: value
    });
  };
  
  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setLocationError('');
  };
  
  const handleSubmitPatientDetails = (e) => {
    e.preventDefault();
    setStep(3);
  };
  
  const handleConfirmRequest = () => {
    if (!location) {
      setLocationError('Please select a location or allow location access');
      return;
    }
    
    // In a real app, this would send the request to a backend
    setRequestSent(true);
    // Simulate a random estimated arrival time between 5 and 15 minutes
    setEstimatedTime(Math.floor(Math.random() * 11) + 5);
  };
  
  const handleNewRequest = () => {
    setStep(1);
    setEmergencyType('');
    setPatientDetails({
      name: '',
      age: '',
      gender: '',
      consciousness: 'conscious',
      breathing: 'normal',
      bleeding: 'no',
      additionalInfo: ''
    });
    setLocation(null);
    setLocationError('');
    setRequestSent(false);
    setEstimatedTime(null);
  };
  
  return (
    <div className="request-ambulance-container">
      <h1>Request Ambulance</h1>
      
      {requestSent ? (
        <div className="confirmation-container">
          <div className="confirmation-message">
            <div className="confirmation-icon">✅</div>
            <h2>Ambulance Request Confirmed!</h2>
            <p>An ambulance has been dispatched to your location.</p>
            <div className="estimated-time">
              <h3>Estimated arrival time: <span>{estimatedTime} minutes</span></h3>
            </div>
            <div className="emergency-tips">
              <h3>While waiting:</h3>
              <ul>
                <li>Stay with the patient</li>
                <li>Keep the patient comfortable</li>
                <li>Clear the area for paramedics</li>
                <li>Gather any relevant medication</li>
                <li>Have someone ready to direct the ambulance</li>
              </ul>
            </div>
            <button className="new-request-btn" onClick={handleNewRequest}>Make a New Request</button>
          </div>
        </div>
      ) : (
        <>
          <div className="progress-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Type</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Details</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Location</div>
          </div>
          
          {step === 1 && (
            <div className="emergency-type-container">
              <h2>Select Emergency Type</h2>
              <div className="emergency-types-grid">
                {emergencyTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`emergency-type-card ${emergencyType === type.id ? 'selected' : ''}`}
                    onClick={() => handleEmergencyTypeSelect(type.id)}
                  >
                    <div className="emergency-icon">{type.icon}</div>
                    <div className="emergency-label">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="patient-details-container">
              <h2>Patient Details</h2>
              <form onSubmit={handleSubmitPatientDetails} className="patient-form">
                <div className="form-group">
                  <label htmlFor="name">Patient Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={patientDetails.name}
                    onChange={handlePatientDetailChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={patientDetails.age}
                      onChange={handlePatientDetailChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={patientDetails.gender}
                      onChange={handlePatientDetailChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="consciousness">Consciousness</label>
                    <select
                      id="consciousness"
                      name="consciousness"
                      value={patientDetails.consciousness}
                      onChange={handlePatientDetailChange}
                    >
                      <option value="conscious">Conscious</option>
                      <option value="unconscious">Unconscious</option>
                      <option value="semiconscious">Semi-conscious</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="breathing">Breathing</label>
                    <select
                      id="breathing"
                      name="breathing"
                      value={patientDetails.breathing}
                      onChange={handlePatientDetailChange}
                    >
                      <option value="normal">Normal</option>
                      <option value="difficult">Difficult</option>
                      <option value="not_breathing">Not Breathing</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="bleeding">Is there severe bleeding?</label>
                  <select
                    id="bleeding"
                    name="bleeding"
                    value={patientDetails.bleeding}
                    onChange={handlePatientDetailChange}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="additionalInfo">Additional Information</label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={patientDetails.additionalInfo}
                    onChange={handlePatientDetailChange}
                    placeholder="Describe the emergency in detail"
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="back-btn" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" className="next-btn">Next</button>
                </div>
              </form>
            </div>
          )}
          
          {step === 3 && (
            <div className="location-container">
              <h2>Confirm Location</h2>
              <p className="location-instruction">Please select your exact location on the map or allow location access for automatic detection.</p>
              
              <MapComponent onLocationSelect={handleLocationSelect} />
              
              <div className="location-confirmation">
                {location ? (
                  <p className="location-selected">
                    Location confirmed ✓
                  </p>
                ) : (
                  <p className="location-not-selected">No location selected yet</p>
                )}
                {locationError && <p className="location-error">{locationError}</p>}
              </div>
              
              <div className="form-actions location-actions">
                <button type="button" className="back-btn" onClick={() => setStep(2)}>Back</button>
                <button 
                  type="button" 
                  className="confirm-btn"
                  onClick={handleConfirmRequest}
                  disabled={!location}
                >
                  Confirm & Request Ambulance
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RequestAmbulance; 