import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Mail, Lock, AlertCircle, Loader2, Sparkles, ChevronLeft } from 'lucide-react';
import '../index.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await API.post('/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const resData = response.data.original || response.data;
      const token = resData.access_token;
      const user = resData.user;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const backendError = err.response.data.message || err.response.data.error || 'بيانات الدخول غير صحيحة.';
        setError(backendError);
      } else {
        setError('تعذر الاتصال بالخادم.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#041a14] font-sans selection:bg-[#D4AF37] selection:text-white" dir="rtl">
      
      {/* ================= خلفية متحركة فاخرة (Aurora & Orbs Effect) ================= */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4AF37] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-[spin_20s_linear_infinite]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#135c47] rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-[spin_25s_linear_infinite_reverse]"></div>
      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-[#0B3B2D] rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-[pulse_8s_ease-in-out_infinite]"></div>
      
      {/* نمط شبكي خفيف يضيف طابعاً تقنياً */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>

      {/* ================= حاوية تسجيل الدخول (Glassmorphism) ================= */}
      <div className="relative z-10 w-full max-w-[420px] p-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* الرأس والشعار */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 mb-6 shadow-inner">
            <Sparkles className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-light tracking-[0.3em] text-white uppercase font-serif">
            MY CLINICS
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 opacity-80">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <p className="text-[#D4AF37] text-xs tracking-widest font-medium">الإدارة الطبية المتقدمة</p>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>
        </div>

        {/* نموذج الإدخال */}
        <form onSubmit={handleLogin} className="space-y-8">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* حقل البريد الإلكتروني (أسلوب غير تقليدي - خط سفلي فقط) */}
          <div className="relative group">
            <Mail className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#D4AF37] transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="البريد الإلكتروني"
              className="w-full bg-transparent border-b border-white/20 pr-10 pl-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
            />
          </div>

          {/* حقل كلمة المرور */}
          <div className="relative group">
            <Lock className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#D4AF37] transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="كلمة المرور"
              className="w-full bg-transparent border-b border-white/20 pr-10 pl-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
            />
          </div>

          {/* زر الدخول (تأثير Hover فاخر) */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-14 bg-gradient-to-l from-[#D4AF37] to-[#AA8C2C] text-[#041a14] font-bold text-sm tracking-widest rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}