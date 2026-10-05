import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home'; // 1. استيراد صفحة Home

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<Login />} />
        
        {/* إعادة توجيه أي مسار فارغ إلى صفحة الدخول */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 2. ربط مسار الداشبورد بصفحة Home الحقيقية بدلاً من النص المؤقت */}
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;