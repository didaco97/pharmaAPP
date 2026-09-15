import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Stethoscope, Store, User } from 'lucide-react';

const Login = () => {
  const { login } = useAppContext();
  const [userId, setUserId] = useState('pat1');
  const [name, setName] = useState('Alice Johnson');
  const [role, setRole] = useState('patient');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'patient') {
      setUserId('pat1');
      setName('Alice Johnson');
    } else if (selectedRole === 'doctor') {
      setUserId('d1');
      setName('Dr. Sarah Smith');
    } else if (selectedRole === 'retailer') {
      setUserId('r1');
      setName('ABC Pharmacy');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim()) {
      login(role, name, userId.trim());
    }
  };

  return (
    <div className="mobile-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 1.5rem', background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)', height: '100%' }}>
      <div className="card glass animate-fade-in" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>MediConnect</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">User ID (optional)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. d1, r1 or custom" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="input-label">Select Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              <button 
                type="button"
                className={`btn ${role === 'patient' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.75rem', fontSize: '0.9rem', justifyContent: 'flex-start' }}
                onClick={() => handleRoleSelect('patient')}
              >
                <User size={18} /> Patient
              </button>
              <button 
                type="button"
                className={`btn ${role === 'doctor' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.75rem', fontSize: '0.9rem', justifyContent: 'flex-start' }}
                onClick={() => handleRoleSelect('doctor')}
              >
                <Stethoscope size={18} /> Doctor
              </button>
              <button 
                type="button"
                className={`btn ${role === 'retailer' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.75rem', fontSize: '0.9rem', justifyContent: 'flex-start' }}
                onClick={() => handleRoleSelect('retailer')}
              >
                <Store size={18} /> Pharmacist / Retailer
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Enter App
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
