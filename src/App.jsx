import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة تسجيل الدخول كمسار افتراضي */}
        <Route path="/login" element={<Login />} />
        
        {/* إعادة توجيه أي مسار فارغ إلى صفحة الدخول */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* مسار مؤقت للداشبورد لحين إنشائها */}
        <Route path="/dashboard" element={
          <div className="min-h-screen flex items-center justify-center bg-primary text-accent text-3xl font-bold" dir="rtl">
            أهلاً بك في لوحة تحكم عيادات MY CLINICS (تم تسجيل الدخول بنجاح!)
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;