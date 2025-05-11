import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    medicalConditions: '',
    bloodType: '',
    createdAt: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, token, updateUser } = useAuth();
  
  useEffect(() => {
    // If no token, redirect to login
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          // Token expired or invalid
          navigate('/login');
          return;
        }
        
        const data = await response.json();
        
        if (response.ok) {
          setUserData({
            ...data.user,
            joinDate: new Date(data.user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          });
          setFormData({
            ...data.user,
            joinDate: new Date(data.user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          });
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch (error) {
        setError('Network error. Please try again later.');
        console.error('Profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate, token]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/updateprofile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          medicalConditions: formData.medicalConditions,
          bloodType: formData.bloodType
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const updatedUserData = {
          ...data.user,
          joinDate: userData.joinDate // Preserve join date from previous state
        };
        setUserData(updatedUserData);
        updateUser(data.user); // Update in context
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
      console.error('Profile update error:', error);
    }
  };
  
  const cancelEdit = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };
  
  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }
  
  if (error) {
    return <div className="profile-error">{error}</div>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {!isEditing && (
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
            <small>Email cannot be changed</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="emergencyContact">Emergency Contact</label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="medicalConditions">Medical Conditions</label>
            <textarea
              id="medicalConditions"
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bloodType">Blood Type</label>
            <select
              id="bloodType"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" className="cancel-btn" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-row">
              <span className="info-label">Full Name:</span>
              <span className="info-value">{userData.fullName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{userData.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{userData.phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Address:</span>
              <span className="info-value">{userData.address}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Joined:</span>
              <span className="info-value">{userData.joinDate}</span>
            </div>
          </div>
          
          <div className="profile-section">
            <h2>Medical Information</h2>
            <div className="info-row">
              <span className="info-label">Blood Type:</span>
              <span className="info-value">{userData.bloodType || 'Not specified'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Medical Conditions:</span>
              <span className="info-value">{userData.medicalConditions || 'None specified'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Emergency Contact:</span>
              <span className="info-value">{userData.emergencyContact}</span>
            </div>
          </div>
          
          <div className="profile-actions">
            <Link to="/request-ambulance" className="action-btn emergency-btn">
              Request Ambulance
            </Link>
            <Link to="/talk-to-doctor" className="action-btn doctor-btn">
              Talk to a Doctor
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile; 