import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

// Pages
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import RetailerDashboard from './pages/RetailerDashboard';

function App() {
  const { user } = useAppContext();

  return (
    <div className="mobile-app-container">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}-dashboard`} />} />
        
        {/* Protected Routes */}
        <Route path="/patient-dashboard" element={user?.role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" />} />
        <Route path="/doctor-dashboard" element={user?.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} />
        <Route path="/retailer-dashboard" element={user?.role === 'retailer' ? <RetailerDashboard /> : <Navigate to="/login" />} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to={user ? `/${user.role}-dashboard` : '/login'} />} />
      </Routes>
    </div>
  );
}

export default App;
