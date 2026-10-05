import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import UserCard from '../components/UserCard';
import AddUserModal from '../components/AddUserModal';
import VerifyCodeModal from '../components/VerifyCodeModal';
import logo from '../assets/MYClinicLogo.jpg';
import { Users, LogOut, Loader2, AlertCircle, RefreshCw, UserPlus, Ticket } from 'lucide-react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/getAllUsers');
      setUsers(response.data.users || []);
    } catch (err) {
      setError('فشل في تحميل بيانات المستخدمين من الخادم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUserAdded = () => {
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative overflow-hidden" dir="rtl">
      
      {/* خلفية زخرفية */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#0B3B2D]/5 rounded-full blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl"></div>

      {/* ============ الشريط العلوي ============ */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-20 px-8 py-4 flex items-center justify-between shadow-sm">
        
        {/* ===== قسم الشعار (المحاذاة المصحّحة) ===== */}
        <div className="flex items-center gap-3 group cursor-default">
          
          {/* الشعار */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-[#D4AF37]/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src={logo} 
              alt="My Clinics Logo" 
              className="relative w-11 h-11 object-contain rounded-xl ring-1 ring-gray-100 group-hover:ring-[#D4AF37]/40 transition-all duration-300" 
            />
          </div>

          {/* النص */}
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-lg font-bold text-[#0B3B2D] tracking-wider leading-tight">
              MY CLINICS
            </h1>
            <p className="text-[11px] text-gray-400 font-medium leading-tight mt-0.5">
              لوحة الإدارة الطبية
            </p>
          </div>
        </div>

        {/* زر تسجيل الخروج */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-red-200 active:scale-95"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>تسجيل الخروج</span>
        </button>
      </header>

      {/* ============ المحتوى الرئيسي ============ */}
      <main className="relative max-w-7xl mx-auto p-8">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين والمرضى</h2>
            <p className="text-xs text-gray-400 mt-1">عرض ومتابعة كافة الحسابات المسجلة في النظام</p>
          </div>

          {/* كل الأزرار مجموعة */}
          <div className="flex items-center gap-2">
            
            {/* إجمالي المستخدمين */}
            <div className="bg-[#0B3B2D] text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span>إجمالي المستخدمين: {users.length}</span>
            </div>

            {/* زر التحقق من كود */}
            <button
              onClick={() => setShowVerifyModal(true)}
              className="group flex items-center gap-2 bg-gradient-to-l from-[#D4AF37] to-[#AA8C2C] hover:shadow-lg hover:shadow-[#D4AF37]/30 text-[#041a14] px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95"
            >
              <Ticket className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span>التحقق من كود</span>
            </button>

            {/* زر إضافة مستخدم */}
            <button
              onClick={() => setShowAddModal(true)}
              className="group flex items-center gap-2 bg-gradient-to-l from-[#0B3B2D] to-[#135c47] hover:shadow-lg hover:shadow-[#0B3B2D]/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform duration-300" />
              <span>إضافة مستخدم</span>
            </button>

            {/* زر التحديث — آخر زر */}
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="group bg-white border border-gray-200 hover:border-[#0B3B2D] text-[#0B3B2D] hover:bg-[#0B3B2D] hover:text-white p-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 transition-transform ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-[#0B3B2D]/20 rounded-full blur-xl animate-pulse"></div>
              <Loader2 className="relative w-8 h-8 animate-spin text-[#0B3B2D] mb-3" />
            </div>
            <p className="text-xs text-gray-400 mt-3 animate-pulse">جاري تحميل بيانات المستخدمين...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchUsers}
              className="text-red-700 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 text-[11px] whitespace-nowrap"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-[#0B3B2D]/5 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[#0B3B2D]/40" />
            </div>
            <p className="text-sm font-semibold text-gray-600">لا يوجد مستخدمون مسجلون بعد</p>
            <p className="text-xs text-gray-400 mt-1">ابدأ بإضافة أول مستخدم من الزر أعلاه</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="animate-[fadeInUp_0.4s_ease-out_both]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <UserCard 
                  user={user}
                  onDelete={(id) => setUsers(prev => prev.filter(u => u.id !== id))}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ============ المودالات ============ */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleUserAdded}
      />

      <VerifyCodeModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
      />

      {/* Keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}