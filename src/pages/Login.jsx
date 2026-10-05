import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Mail, Lock, AlertCircle, Loader2, Sparkles, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import '../index.css';
import logo from '../assets/MYClinicLogo.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="relative z-10 w-full max-w-[420px] p-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/20 hover:shadow-[0_25px_60px_rgba(212,175,55,0.1)] mx-4">
        
        {/* خط ذهبي علوي مزخرف */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60"></div>

        {/* الرأس والشعار */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 mb-6 shadow-inner relative group overflow-hidden">
  {/* توهج ذهبي خلفي */}
  <div className="absolute inset-0 rounded-3xl bg-[#D4AF37]/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  
  {/* ✅ صورة الشعار */}
  <img 
    src={logo} 
    alt="My Clinics Logo" 
    className="relative w-14 h-14 object-contain rounded-2xl group-hover:scale-110 transition-transform duration-500"
  />
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
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-3 animate-[shake_0.4s_ease-in-out]">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* حقل البريد الإلكتروني (أسلوب غير تقليدي - خط سفلي فقط) */}
          <div className="relative group">
            <Mail className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#D4AF37] transition-colors duration-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="البريد الإلكتروني"
              className="peer w-full bg-transparent border-b border-white/20 pr-10 pl-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
            />
            {/* خط ذهبي متحرك تحت الحقل */}
            <div className="absolute bottom-0 right-0 h-[1px] w-0 bg-[#D4AF37] peer-focus:w-full transition-all duration-500"></div>
          </div>

          {/* حقل كلمة المرور */}
          <div className="relative group">
            <Lock className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#D4AF37] transition-colors duration-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="كلمة المرور"
              className="peer w-full bg-transparent border-b border-white/20 pr-10 pl-12 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
            />
            {/* زر إظهار/إخفاء كلمة المرور */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#D4AF37] transition-colors duration-300 p-1"
              tabIndex={-1}
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {/* خط ذهبي متحرك تحت الحقل */}
            <div className="absolute bottom-0 right-0 h-[1px] w-0 bg-[#D4AF37] peer-focus:w-full transition-all duration-500"></div>
          </div>

          {/* زر الدخول (تأثير Hover فاخر) */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-14 bg-gradient-to-l from-[#D4AF37] to-[#AA8C2C] text-[#041a14] font-bold text-sm tracking-widest rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {/* تأثير لمعان عند المرور */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
              
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="relative">تسجيل الدخول</span>
                  <ChevronLeft className="relative w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>
        </form>

        
        
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}