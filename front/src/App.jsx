import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import RequestAmbulance from './pages/RequestAmbulance';
import TalkToDoctor from './pages/TalkToDoctor';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/request-ambulance" element={
              <ProtectedRoute>
                <RequestAmbulance />
              </ProtectedRoute>
            } />
            <Route path="/talk-to-doctor" element={
              <ProtectedRoute>
                <TalkToDoctor />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} MedEmergency App. All rights reserved.</p>
            <p>For emergencies, please dial your local emergency number.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
