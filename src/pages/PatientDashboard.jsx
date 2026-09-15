import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LogOut, User as UserIcon, Activity, Stethoscope, Store, Send, CheckCircle, ChevronLeft, Pill, Bell } from 'lucide-react';

const PatientDashboard = () => {
  const { 
    user, logout, doctors, retailers, patientProfiles, updatePatientProfile, 
    requestDoctor, doctorRequests, chats, sendMessage, 
    prescriptions, addSelfMedication, adherenceLogs, logAdherence, requestMedicine 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('doctors');
  
  const profile = patientProfiles[user.id] || { age: '', height: '', weight: '', diseaseHistory: '', mobile: '', address: '', diagnosis: '', medications: '' };

  const [formData, setFormData] = useState(profile);
  const [activeRetailerChat, setActiveRetailerChat] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  
  // Medicine request form state
  const [showMedReq, setShowMedReq] = useState(false);
  const [medReqName, setMedReqName] = useState('');
  const [medReqQty, setMedReqQty] = useState('');

  // Self medication tracking state
  const [showSelfMedReq, setShowSelfMedReq] = useState(false);
  const [selfMedForm, setSelfMedForm] = useState({ medicine: '', quantity: '', days: '', instructions: '' });

  const myPrescriptions = prescriptions.filter(p => p.patientId === user.id);
  const myAdherence = adherenceLogs.filter(l => l.patientId === user.id);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updatePatientProfile(formData);
    alert('Profile saved!');
  };

  const handleRequestDoctor = (doctorId, type) => {
    requestDoctor(doctorId, type);
    alert(`${type} request sent!`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessage.trim() && activeRetailerChat) {
      sendMessage(activeRetailerChat, chatMessage, 'text');
      setChatMessage('');
    }
  };

  const submitMedicineRequest = (e) => {
    e.preventDefault();
    if (medReqName && medReqQty && activeRetailerChat) {
      requestMedicine(activeRetailerChat, medReqName, medReqQty);
      alert('Medicine requested!');
      setShowMedReq(false);
      setMedReqName('');
      setMedReqQty('');
    }
  };

  const submitSelfMedication = (e) => {
    e.preventDefault();
    addSelfMedication(selfMedForm.medicine, parseInt(selfMedForm.quantity), parseInt(selfMedForm.days), selfMedForm.instructions);
    alert('Medication added!');
    setShowSelfMedReq(false);
    setSelfMedForm({ medicine: '', quantity: '', days: '', instructions: '' });
  };

  const handleLogDose = (rxId, status) => {
    logAdherence(rxId, status);
  };

  const renderProfile = () => (
    <div className="animate-fade-in">
      <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserIcon size={18} className="text-primary" /> Patient Profile
        </h3>
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Mobile Number</label>
            <input type="tel" className="input-field" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Address</label>
            <input type="text" className="input-field" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="input-label">Age</label>
              <input type="number" className="input-field" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="input-label">Weight (kg)</label>
              <input type="number" className="input-field" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Disease / Diagnosis</label>
            <textarea className="input-field" rows="2" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})}></textarea>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Disease History</label>
            <textarea className="input-field" rows="2" value={formData.diseaseHistory} onChange={e => setFormData({...formData, diseaseHistory: e.target.value})}></textarea>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Medication History</label>
            <textarea className="input-field" rows="2" value={formData.medications} onChange={e => setFormData({...formData, medications: e.target.value})}></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Profile</button>
        </form>
      </div>
      <button className="btn btn-outline" style={{ width: '100%', color: 'var(--error)' }} onClick={logout}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  );

  const renderDoctorConnect = () => (
    <div className="animate-fade-in">
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Stethoscope size={18} color="var(--primary)" /> Find Doctor
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {doctors.map(doc => {
          const hasRequested = doctorRequests.some(r => r.doctorId === doc.id && r.patientId === user.id);
          return (
            <div key={doc.id} className="card" style={{ padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.25rem 0' }}>{doc.name}</h4>
              <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>{doc.degree} • {doc.specialty}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>📞 {doc.mobile} | 📍 {doc.address}</p>
              
              {!hasRequested ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }} onClick={() => handleRequestDoctor(doc.id, 'OPD')}>
                    OPD Registration
                  </button>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }} onClick={() => handleRequestDoctor(doc.id, 'Inquiry')}>
                    Inquiry
                  </button>
                </div>
              ) : (
                <button className="btn btn-outline" style={{ width: '100%', padding: '0.6rem' }} disabled>
                  <CheckCircle size={16}/> Request Sent
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );

  const renderRetailerHub = () => {
    if (activeRetailerChat) {
      const retailer = retailers.find(r => r.id === activeRetailerChat);
      const retailerChats = chats.filter(c => 
        (c.senderId === user.id && c.receiverId === activeRetailerChat) ||
        (c.senderId === activeRetailerChat && c.receiverId === user.id)
      );

      return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => {setActiveRetailerChat(null); setShowMedReq(false);}}>
              <ChevronLeft size={20} />
            </button>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{retailer.name}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>📞 {retailer.mobile}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button className={`btn ${!showMedReq ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, padding: '0.5rem' }} onClick={() => setShowMedReq(false)}>Chat</button>
            <button className={`btn ${showMedReq ? 'btn-secondary' : 'btn-outline'}`} style={{ flex: 1, padding: '0.5rem' }} onClick={() => setShowMedReq(true)}>Request Medicine</button>
          </div>

          {showMedReq ? (
            <div className="card" style={{ padding: '1rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Request Medicine</h4>
              <form onSubmit={submitMedicineRequest} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Medicine Name / Prescription</label>
                  <input type="text" className="input-field" value={medReqName} onChange={e => setMedReqName(e.target.value)} required />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Quantity</label>
                  <input type="text" className="input-field" value={medReqQty} onChange={e => setMedReqQty(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Submit Request</button>
              </form>
            </div>
          ) : (
            <>
              <div className="chat-container">
                {retailerChats.length === 0 && <div style={{textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem'}}>No messages yet.</div>}
                {retailerChats.map(c => (
                  <div key={c.id} className={`chat-bubble ${c.senderId === user.id ? 'sent' : 'received'}`}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{c.message}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ flex: 1, padding: '0.6rem' }} 
                  placeholder="Message..." 
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem' }}>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="animate-fade-in">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Store size={18} color="var(--primary)" /> Find Pharmacist
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Compare available medicine prices and choose a suitable registered pharmacist.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {retailers.map(ret => (
            <div key={ret.id} className="card" style={{ padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.25rem 0' }}>{ret.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>📍 {ret.location}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>📞 {ret.mobile}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '1rem', padding: '0.5rem', background: 'var(--background)', borderRadius: '6px' }}>
                <div><strong>Prices:</strong> {ret.prices}</div>
                <div>⭐ {ret.rating}</div>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.6rem' }}
                onClick={() => setActiveRetailerChat(ret.id)}
              >
                Connect / Order
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMyMedications = () => {
    const now = new Date();

    return (
      <div className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Pill size={18} color="var(--primary)" /> My Medications
          </h3>
          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setShowSelfMedReq(!showSelfMedReq)}>
            + Add Med
          </button>
        </div>

        {showSelfMedReq && (
          <form onSubmit={submitSelfMedication} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Track New Medication</h4>
            <input type="text" className="input-field" placeholder="Medicine Name" value={selfMedForm.medicine} onChange={e => setSelfMedForm({...selfMedForm, medicine: e.target.value})} required />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="number" className="input-field" placeholder="Qty" value={selfMedForm.quantity} onChange={e => setSelfMedForm({...selfMedForm, quantity: e.target.value})} required />
              <input type="number" className="input-field" placeholder="Days" value={selfMedForm.days} onChange={e => setSelfMedForm({...selfMedForm, days: e.target.value})} required />
            </div>
            <input type="text" className="input-field" placeholder="Instructions" value={selfMedForm.instructions} onChange={e => setSelfMedForm({...selfMedForm, instructions: e.target.value})} required />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem' }}>Save Medication</button>
          </form>
        )}

        {/* Refill Reminders Area */}
        {myPrescriptions.map(rx => {
          const refillDue = new Date(rx.refillDueAt);
          const diffDays = Math.ceil((refillDue - now) / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 3 && diffDays >= -7) {
            return (
              <div key={`alert-${rx.id}`} className="card animate-fade-in" style={{ padding: '1rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fef2f2, #fff1f2)', border: '1px solid #fecdd3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e11d48', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <Bell size={18} /> SMART REFILL REMINDER
                </div>
                <p style={{ fontSize: '0.9rem', margin: 0, color: '#881337' }}>
                  <strong>{rx.medicine}</strong> is running low. Refill due {diffDays > 0 ? `in ${diffDays} days` : 'now'}.
                </p>
                <button className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', marginTop: '0.75rem', fontSize: '0.85rem', backgroundColor: '#e11d48' }} onClick={() => setActiveTab('retailers')}>
                  Find Pharmacy
                </button>
              </div>
            );
          }
          return null;
        })}

        {/* Medication Adherence Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myPrescriptions.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem' }}>
              No active prescriptions found.
            </div>
          )}
          {myPrescriptions.map(rx => {
            const rxLogs = myAdherence.filter(l => l.prescriptionId === rx.id);
            const todayLog = rxLogs.find(l => new Date(l.date).toDateString() === now.toDateString());
            
            return (
              <div key={rx.id} className="card" style={{ padding: '1rem' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary)' }}>{rx.medicine}</h4>
                <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Qty: {rx.quantity} for {rx.days} days</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>Instructions: {rx.instructions}</p>
                
                <div style={{ background: 'var(--background)', padding: '0.75rem', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 500 }}>Adherence Tracking (Today)</p>
                  {todayLog ? (
                    <div style={{ fontSize: '0.85rem', color: todayLog.status === 'taken' ? 'var(--success)' : 'var(--error)' }}>
                      {todayLog.status === 'taken' ? '✅ Dose taken today' : '❌ Dose missed today'}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: 'var(--success)', color: 'white' }} onClick={() => handleLogDose(rx.id, 'taken')}>Took it</button>
                      <button className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => handleLogDose(rx.id, 'missed')}>Missed it</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="app-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>MediConnect</h2>
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.name}</div>
      </div>
      
      <div className="mobile-content">
        {activeTab === 'doctors' && renderDoctorConnect()}
        {activeTab === 'retailers' && renderRetailerHub()}
        {activeTab === 'meds' && renderMyMedications()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      <div className="bottom-nav">
        <button className={`nav-item ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
          <Stethoscope size={24} />
          <span>Doctors</span>
        </button>
        <button className={`nav-item ${activeTab === 'retailers' ? 'active' : ''}`} onClick={() => { setActiveTab('retailers'); setActiveRetailerChat(null); }}>
          <Store size={24} />
          <span>Retailers</span>
        </button>
        <button className={`nav-item ${activeTab === 'meds' ? 'active' : ''}`} onClick={() => setActiveTab('meds')}>
          <Pill size={24} />
          <span>My Meds</span>
        </button>
        <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <UserIcon size={24} />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};

export default PatientDashboard;
