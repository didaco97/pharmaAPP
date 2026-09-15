import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LogOut, Activity, MessageSquare, Send, ChevronLeft, User as UserIcon, ClipboardList, Check, Bell } from 'lucide-react';

const RetailerDashboard = () => {
  const { 
    user, logout, chats, sendMessage, retailerProfiles, updateRetailerProfile,
    medicineRequests, updateMedicineRequest, prescriptions 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [activeChatPatient, setActiveChatPatient] = useState(null);
  const [chatMessage, setChatMessage] = useState('');

  const profile = retailerProfiles[user.id] || { storeName: user.name, phone: '', location: '' };
  const [formData, setFormData] = useState(profile);

  const patientChats = chats.filter(c => c.receiverId === user.id || c.senderId === user.id);
  const uniquePatientIds = [...new Set(patientChats.map(c => c.senderId === user.id ? c.receiverId : c.senderId))];

  const myOrders = medicineRequests.filter(r => r.retailerId === user.id);

  const getPatientName = (id) => `Patient (${id.split('-')[1]?.slice(-4) || 'User'})`;

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateRetailerProfile(formData);
    alert('Pharmacist profile saved!');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessage.trim() && activeChatPatient) {
      sendMessage(activeChatPatient, chatMessage, 'text');
      setChatMessage('');
    }
  };

  const handleUpdateStatus = (reqId, status) => {
    updateMedicineRequest(reqId, status);
  };

  const renderProfile = () => (
    <div className="animate-fade-in">
      <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserIcon size={18} className="text-primary" /> Pharmacist Profile
        </h3>
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Pharmacist / Pharmacy Name</label>
            <input type="text" className="input-field" value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} required />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Mobile Number</label>
            <input type="tel" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Address</label>
            <textarea className="input-field" rows="3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Profile</button>
        </form>
      </div>
      <button className="btn btn-outline" style={{ width: '100%', color: 'var(--error)' }} onClick={logout}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  );

  const renderOrders = () => {
    // Generate refill alerts for any patient that has ordered from this pharmacy before
    const now = new Date();
    const refillAlerts = [];
    
    uniquePatientIds.forEach(pId => {
      const pRxs = prescriptions.filter(p => p.patientId === pId);
      pRxs.forEach(rx => {
        const refillDue = new Date(rx.refillDueAt);
        const diffDays = Math.ceil((refillDue - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 3 && diffDays >= -7) {
          refillAlerts.push({ ...rx, diffDays, pId });
        }
      });
    });

    return (
      <div className="animate-fade-in">
        {/* Refill Alerts */}
        {refillAlerts.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e11d48' }}>
              <Bell size={18} /> Smart Refill Alerts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {refillAlerts.map(alert => (
                <div key={`alert-${alert.id}`} className="card" style={{ padding: '0.75rem 1rem', background: 'linear-gradient(to right, #fef2f2, #fff1f2)', border: '1px solid #fecdd3' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: '#881337', fontSize: '0.9rem' }}>{getPatientName(alert.pId)}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#be123c' }}>{alert.medicine} running low ({alert.diffDays > 0 ? `in ${alert.diffDays} days` : 'now'})</p>
                    </div>
                    <button className="btn btn-outline" style={{ padding: '0.4rem', borderColor: '#e11d48', color: '#e11d48' }} onClick={() => { setActiveTab('chats'); setActiveChatPatient(alert.pId); }}>
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ClipboardList size={18} color="var(--primary)" /> Patient Orders
        </h3>
        
        {myOrders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
            No medicine requests yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myOrders.slice().reverse().map(req => (
              <div key={req.id} className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>{req.patientName}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(req.date).toLocaleDateString()}</span>
                </div>
                
                <div style={{ background: 'var(--background)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Medicine:</span>
                    <strong style={{ fontSize: '0.9rem' }}>{req.medicine}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quantity:</span>
                    <strong style={{ fontSize: '0.9rem' }}>{req.quantity}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {req.status === 'pending' ? (
                    <button className="btn btn-primary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }} onClick={() => handleUpdateStatus(req.id, 'Dispensed')}>
                      Mark Dispensed
                    </button>
                  ) : (
                    <button className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', color: 'var(--success)', borderColor: 'var(--success)' }} disabled>
                      <Check size={16} /> Dispensed
                    </button>
                  )}
                  <button className="btn btn-outline" style={{ padding: '0.6rem' }} onClick={() => { setActiveTab('chats'); setActiveChatPatient(req.patientId); }}>
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderChatInterface = () => {
    const currentChats = patientChats.filter(c => 
      (c.senderId === user.id && c.receiverId === activeChatPatient) ||
      (c.senderId === activeChatPatient && c.receiverId === user.id)
    );

    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => setActiveChatPatient(null)}>
            <ChevronLeft size={20} />
          </button>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{getPatientName(activeChatPatient)}</h3>
        </div>
        
        <div className="chat-container">
          {currentChats.length === 0 && <div style={{textAlign: 'center', color: 'var(--text-muted)'}}>No messages.</div>}
          {currentChats.map(c => (
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
            placeholder="Type your reply..." 
            value={chatMessage}
            onChange={e => setChatMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    );
  };

  const renderChatsList = () => (
    <div className="animate-fade-in">
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageSquare size={18} color="var(--primary)" /> Active Chats
      </h3>
      
      {uniquePatientIds.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
          No active chats.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {uniquePatientIds.map(patientId => (
            <button 
              key={patientId}
              className="card" 
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', padding: '1rem' }}
              onClick={() => setActiveChatPatient(patientId)}
            >
              <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>{getPatientName(patientId)}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tap to open chat</p>
              </div>
            </button>
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
        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--primary)' }}>Pharmacist</div>
      </div>
      
      <div className="mobile-content">
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'chats' && (activeChatPatient ? renderChatInterface() : renderChatsList())}
        {activeTab === 'profile' && renderProfile()}
      </div>

      <div className="bottom-nav">
        <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); }}>
          <ClipboardList size={24} />
          <span>Orders</span>
        </button>
        <button className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => { setActiveTab('chats'); setActiveChatPatient(null); }}>
          <MessageSquare size={24} />
          <span>Chats</span>
        </button>
        <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <UserIcon size={24} />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};

export default RetailerDashboard;
