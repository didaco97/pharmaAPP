import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LogOut, Activity, Users, ChevronLeft, User as UserIcon, Plus } from 'lucide-react';

const DoctorDashboard = () => {
  const { 
    user, logout, doctorRequests, patientProfiles, doctorProfiles, updateDoctorProfile,
    prescriptions, adherenceLogs, addPrescription
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const profile = doctorProfiles[user.id] || { name: user.name, degree: '', email: '', clinicAddress: '', specialty: '' };
  const [formData, setFormData] = useState(profile);

  // Prescription Form State
  const [showRxForm, setShowRxForm] = useState(false);
  const [rxForm, setRxForm] = useState({ medicine: '', quantity: '', days: '', instructions: '' });

  const myRequests = doctorRequests.filter(r => r.doctorId === user.id);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateDoctorProfile(formData);
    alert('Doctor profile saved!');
  };

  const submitPrescription = (e) => {
    e.preventDefault();
    addPrescription(selectedPatient.patientId, rxForm.medicine, parseInt(rxForm.quantity), parseInt(rxForm.days), rxForm.instructions);
    alert('Prescription added!');
    setShowRxForm(false);
    setRxForm({ medicine: '', quantity: '', days: '', instructions: '' });
  };

  const renderProfile = () => (
    <div className="animate-fade-in">
      <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserIcon size={18} className="text-primary" /> Doctor Profile
        </h3>
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Full Name</label>
            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Degree(s)</label>
            <input type="text" className="input-field" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} placeholder="e.g. MBBS, MD" required />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Specialty</label>
            <input type="text" className="input-field" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} required />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Email</label>
            <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Clinic Address</label>
            <textarea className="input-field" rows="3" value={formData.clinicAddress} onChange={e => setFormData({...formData, clinicAddress: e.target.value})} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Profile</button>
        </form>
      </div>
      <button className="btn btn-outline" style={{ width: '100%', color: 'var(--error)' }} onClick={logout}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  );

  const renderPatientDetails = (request) => {
    const pProfile = patientProfiles[request.patientId] || {};
    const patientRxs = prescriptions.filter(p => p.patientId === request.patientId);
    
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => { setSelectedPatient(null); setShowRxForm(false); }}>
            <ChevronLeft size={20} />
          </button>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{request.patientName}</h3>
        </div>
        
        <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Clinical Information</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span><strong>Age:</strong> {pProfile.age || 'N/A'}</span>
            <span><strong>Mobile:</strong> {pProfile.mobile || 'N/A'}</span>
          </div>
          
          <div>
            <strong style={{ fontSize: '0.9rem' }}>Primary Diagnosis:</strong>
            <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>{pProfile.diagnosis || 'None provided'}</p>
          </div>
          
          <div>
            <strong style={{ fontSize: '0.9rem' }}>Disease History:</strong>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{pProfile.diseaseHistory || 'None provided'}</p>
          </div>
          
          <div>
            <strong style={{ fontSize: '0.9rem' }}>Prior Medication History:</strong>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{pProfile.medications || 'None provided'}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0 }}>Prescriptions & Adherence</h4>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setShowRxForm(!showRxForm)}>
              <Plus size={16} /> New Rx
            </button>
          </div>

          {showRxForm && (
            <form onSubmit={submitPrescription} style={{ background: 'var(--background)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input type="text" className="input-field" placeholder="Medicine Name" value={rxForm.medicine} onChange={e => setRxForm({...rxForm, medicine: e.target.value})} required />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" className="input-field" placeholder="Qty" value={rxForm.quantity} onChange={e => setRxForm({...rxForm, quantity: e.target.value})} required />
                <input type="number" className="input-field" placeholder="Days" value={rxForm.days} onChange={e => setRxForm({...rxForm, days: e.target.value})} required />
              </div>
              <input type="text" className="input-field" placeholder="Instructions (e.g., 1 pill after dinner)" value={rxForm.instructions} onChange={e => setRxForm({...rxForm, instructions: e.target.value})} required />
              <button type="submit" className="btn btn-primary">Prescribe</button>
            </form>
          )}

          {patientRxs.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No active prescriptions.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {patientRxs.map(rx => {
                const rxLogs = adherenceLogs.filter(l => l.prescriptionId === rx.id);
                const takenCount = rxLogs.filter(l => l.status === 'taken').length;
                const adherenceRate = rxLogs.length > 0 ? Math.round((takenCount / rxLogs.length) * 100) : 0;
                
                return (
                  <div key={rx.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '0.75rem' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>{rx.medicine} <span style={{ fontWeight: 400, fontSize: '0.8rem', color: 'var(--text-muted)' }}>({rx.quantity} for {rx.days} days)</span></p>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rx.instructions}</p>
                    <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                      <strong>Patient-Reported Adherence:</strong> {rxLogs.length > 0 ? `${adherenceRate}% (${takenCount}/${rxLogs.length} logged doses)` : 'No data yet'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRequests = () => (
    <div className="animate-fade-in">
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Users size={18} color="var(--primary)" /> Service Requests
      </h3>
      
      {myRequests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
          No patient requests yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myRequests.map(req => (
            <div key={req.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>{req.patientName}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--background)', borderRadius: '12px', fontWeight: 500, color: 'var(--primary)' }}>
                    {req.type || 'OPD'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(req.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button 
                className="btn btn-outline"
                style={{ padding: '0.5rem 1rem' }}
                onClick={() => setSelectedPatient(req)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="app-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>MediConnect</h2>
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--primary)' }}>Dr. {user.name.split(' ')[0]}</div>
      </div>
      
      <div className="mobile-content">
        {activeTab === 'requests' && (selectedPatient ? renderPatientDetails(selectedPatient) : renderRequests())}
        {activeTab === 'profile' && renderProfile()}
      </div>

      <div className="bottom-nav">
        <button className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => { setActiveTab('requests'); setSelectedPatient(null); }}>
          <Users size={24} />
          <span>My Patients</span>
        </button>
        <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <UserIcon size={24} />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};

export default DoctorDashboard;
