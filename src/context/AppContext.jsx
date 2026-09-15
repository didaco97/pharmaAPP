import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Current logged in user
  const [user, setUser] = useState(null);

  // Mock Users data
  const [doctors] = useState([
    { id: 'd1', name: 'Dr. Sarah Smith', degree: 'MBBS, MD', specialty: 'Cardiologist', experience: '15 years', fee: '$100', rating: 4.8, mobile: '+1 555-0101', address: 'Heart Care Center, 123 Main St' },
    { id: 'd2', name: 'Dr. John Doe', degree: 'MBBS, DO', specialty: 'General Physician', experience: '8 years', fee: '$50', rating: 4.5, mobile: '+1 555-0102', address: 'City Clinic, 456 Oak Ave' },
    { id: 'd3', name: 'Dr. Emily Chen', degree: 'MBBS, FAAD', specialty: 'Dermatologist', experience: '12 years', fee: '$80', rating: 4.9, mobile: '+1 555-0103', address: 'Skin Wellness, 789 Pine Rd' },
  ]);

  const [retailers] = useState([
    { id: 'r1', name: 'ABC Pharmacy', location: 'Downtown Medical Complex', deliveryTime: '30 mins', rating: 4.7, mobile: '+1 555-2001', prices: 'Competitive' },
    { id: 'r2', name: 'MediCare Plus', location: 'Uptown Shopping Center', deliveryTime: '45 mins', rating: 4.4, mobile: '+1 555-2002', prices: 'Standard' },
    { id: 'r3', name: 'QuickMeds', location: 'Suburbs Avenue', deliveryTime: '2 hours', rating: 4.6, mobile: '+1 555-2003', prices: 'Discounted' },
  ]);

  // Profiles
  const [patientProfiles, setPatientProfiles] = useState({
    'pat1': { age: '34', height: '165', weight: '68', diagnosis: 'Hypertension', diseaseHistory: 'None', mobile: '555-0987', address: '42 Maple Street', medications: 'Lisinopril 10mg' }
  });
  const [doctorProfiles, setDoctorProfiles] = useState({
    'd1': { name: 'Dr. Sarah Smith', degree: 'MBBS, MD', specialty: 'Cardiologist', email: 'sarah.smith@mediconnect.com', clinicAddress: 'Heart Care Center, 123 Main St' }
  });
  const [retailerProfiles, setRetailerProfiles] = useState({
    'r1': { storeName: 'ABC Pharmacy', phone: '+1 555-2001', location: 'Downtown Medical Complex' }
  });

  // Doctor Requests (OPD/Inquiry)
  const [doctorRequests, setDoctorRequests] = useState([
    { id: 'req-1', patientId: 'pat1', patientName: 'Alice Johnson', doctorId: 'd1', type: 'OPD', status: 'pending', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ]);

  // Chats between Patient and Retailer
  const [chats, setChats] = useState([
    { id: 'c1', senderId: 'pat1', receiverId: 'r1', message: 'Hello, do you have Amoxicillin in stock?', type: 'text', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'c2', senderId: 'r1', receiverId: 'pat1', message: 'Yes, we do! You can request it through the app.', type: 'text', timestamp: new Date(Date.now() - 3000000).toISOString() }
  ]);

  // NEW: Prescriptions from Doctors
  // Array of { id, patientId, doctorId, medicine, quantity, days, instructions, date, refillDueAt }
  const [prescriptions, setPrescriptions] = useState([
    { id: 'rx-1', patientId: 'pat1', doctorId: 'd1', medicine: 'Lisinopril 10mg', quantity: 30, days: 30, instructions: '1 tablet daily in the morning', date: new Date(Date.now() - 25 * 86400000).toISOString(), refillDueAt: new Date(Date.now() + 3 * 86400000).toISOString() }
  ]);

  // NEW: Medication Adherence Logs from Patients
  // Array of { id, patientId, prescriptionId, status (taken/missed), date }
  const [adherenceLogs, setAdherenceLogs] = useState([
    { id: 'log-1', patientId: 'pat1', prescriptionId: 'rx-1', status: 'taken', date: new Date(Date.now() - 86400000).toISOString() }
  ]);

  // NEW: Medicine Requests to Pharmacists
  // Array of { id, patientId, retailerId, medicine, quantity, status (pending/dispensed), date }
  const [medicineRequests, setMedicineRequests] = useState([
    { id: 'mr-1', patientId: 'pat1', patientName: 'Alice Johnson', retailerId: 'r1', medicine: 'Lisinopril 10mg', quantity: '30 tablets', status: 'pending', date: new Date().toISOString() }
  ]);

  // Auth actions
  const login = (role, name, userId) => {
    const id = userId || `${role}-${Date.now()}`;
    setUser({ id, role, name });
  };

  const logout = () => {
    setUser(null);
  };

  // Profile Actions
  const updatePatientProfile = (profileData) => {
    if (user && user.role === 'patient') {
      setPatientProfiles(prev => ({ ...prev, [user.id]: profileData }));
    }
  };

  const updateDoctorProfile = (profileData) => {
    if (user && user.role === 'doctor') {
      setDoctorProfiles(prev => ({ ...prev, [user.id]: profileData }));
    }
  };

  const updateRetailerProfile = (profileData) => {
    if (user && user.role === 'retailer') {
      setRetailerProfiles(prev => ({ ...prev, [user.id]: profileData }));
    }
  };

  const requestDoctor = (doctorId, type = 'OPD') => {
    if (user && user.role === 'patient') {
      setDoctorRequests(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          patientId: user.id,
          patientName: user.name,
          doctorId,
          type, // 'OPD' or 'Inquiry'
          status: 'pending',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const sendMessage = (receiverId, message, type = 'text') => {
    if (user) {
      setChats(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          senderId: user.id,
          receiverId,
          message,
          type,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const addPrescription = (patientId, medicine, quantity, days, instructions) => {
    if (user && user.role === 'doctor') {
      const now = new Date();
      // Calculate refill due date (e.g. 2 days before it runs out)
      const refillDueAt = new Date(now.getTime() + (days - 2) * 24 * 60 * 60 * 1000).toISOString();
      
      setPrescriptions(prev => [
        ...prev,
        {
          id: `rx-${Date.now()}`,
          patientId,
          doctorId: user.id,
          medicine,
          quantity,
          days,
          instructions,
          date: now.toISOString(),
          refillDueAt
        }
      ]);
    }
  };

  const addSelfMedication = (medicine, quantity, days, instructions) => {
    if (user && user.role === 'patient') {
      const now = new Date();
      const refillDueAt = new Date(now.getTime() + (days - 2) * 24 * 60 * 60 * 1000).toISOString();
      
      setPrescriptions(prev => [
        ...prev,
        {
          id: `self-${Date.now()}`,
          patientId: user.id,
          doctorId: 'self', // Indicates patient added it manually
          medicine,
          quantity,
          days,
          instructions,
          date: now.toISOString(),
          refillDueAt
        }
      ]);
    }
  };

  const logAdherence = (prescriptionId, status) => {
    if (user && user.role === 'patient') {
      setAdherenceLogs(prev => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          patientId: user.id,
          prescriptionId,
          status, // 'taken' or 'missed'
          date: new Date().toISOString()
        }
      ]);
    }
  };

  const requestMedicine = (retailerId, medicine, quantity) => {
    if (user && user.role === 'patient') {
      setMedicineRequests(prev => [
        ...prev,
        {
          id: `req-${Date.now()}`,
          patientId: user.id,
          patientName: user.name,
          retailerId,
          medicine,
          quantity,
          status: 'pending',
          date: new Date().toISOString()
        }
      ]);
    }
  };

  const updateMedicineRequest = (requestId, status) => {
    if (user && user.role === 'retailer') {
      setMedicineRequests(prev => prev.map(req => req.id === requestId ? { ...req, status } : req));
    }
  };

  const value = {
    user,
    login,
    logout,
    doctors,
    retailers,
    patientProfiles,
    updatePatientProfile,
    doctorProfiles,
    updateDoctorProfile,
    retailerProfiles,
    updateRetailerProfile,
    doctorRequests,
    requestDoctor,
    chats,
    sendMessage,
    prescriptions,
    addPrescription,
    addSelfMedication,
    adherenceLogs,
    logAdherence,
    medicineRequests,
    requestMedicine,
    updateMedicineRequest
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
