import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Emergency Medical Assistance</h1>
        <p>Quick access to emergency services when you need them most</p>
        <div className="emergency-actions">
          <Link to="/request-ambulance" className="btn btn-primary">
            Request Ambulance
          </Link>
          <Link to="/talk-to-doctor" className="btn btn-secondary">
            Talk to a Doctor
          </Link>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🚑</div>
          <h3>Fast Ambulance Service</h3>
          <p>Request an ambulance with real-time tracking and estimated arrival time.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👨‍⚕️</div>
          <h3>Medical Consultation</h3>
          <p>Connect with certified doctors for immediate medical advice.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🏥</div>
          <h3>Hospital Information</h3>
          <p>Find nearby hospitals, emergency rooms, and medical facilities.</p>
        </div>
      </div>
      
      <div className="info-section">
        <h2>How It Works</h2>
        <ol className="steps-list">
          <li>Create an account or sign in to your profile</li>
          <li>Enable location services for faster assistance</li>
          <li>Request an ambulance or talk to a doctor</li>
          <li>Receive immediate support and assistance</li>
        </ol>
      </div>
    </div>
  );
}

export default Home; 