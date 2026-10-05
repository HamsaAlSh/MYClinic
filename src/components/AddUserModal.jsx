import React, { useState } from 'react';
import API from '../services/api';
import { X, User, Mail, Lock, Percent, Loader2, AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    max_discount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // امسح خطأ الحقل عند الكتابة
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('first_name', formData.first_name);
      fd.append('last_name', formData.last_name);
      fd.append('email', formData.email);
      fd.append('password', formData.password);
      fd.append('max_discount', formData.max_discount);

      const res = await API.post('/addUser', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.(res.data);
        handleClose();
      }, 1200);
    } catch (err) {
      // معالجة خطأ 422 (Validation)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError(err.response.data.message || 'تحقق من صحة البيانات');
      } else {
        setError(err.response?.data?.message || 'فشل في إضافة المستخدم');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      max_discount: '',
    });
    setError('');
    setFieldErrors({});
    setSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={handleClose}
      dir="rtl"
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* شريط علوي ذهبي */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-[#0B3B2D] via-[#D4AF37] to-[#0B3B2D]"></div>

        {/* رأس المودال */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B3B2D] to-[#135c47] flex items-center justify-center shadow-sm">
              <UserPlus className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">إضافة مستخدم جديد</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">أدخل بيانات المستخدم المطلوبة</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم المودال */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 animate-[scaleIn_0.3s_ease-out]">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">تمت الإضافة بنجاح</h3>
            <p className="text-xs text-gray-400">جاري تحديث القائمة...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
            
            {/* رسالة الخطأ العامة */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-[shake_0.4s_ease-out]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* الاسم الأول + الاسم الأخير */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                  الاسم الأول
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="فريد"
                    className={`w-full bg-[#F8F9FA] border rounded-xl pr-9 pl-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3B2D]/20 focus:border-[#0B3B2D]/30 focus:bg-white transition-all ${
                      fieldErrors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {fieldErrors.first_name && (
                  <p className="text-[10px] text-red-500 mt-1">{fieldErrors.first_name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                  الاسم الأخير
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="جماني"
                    className={`w-full bg-[#F8F9FA] border rounded-xl pr-9 pl-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3B2D]/20 focus:border-[#0B3B2D]/30 focus:bg-white transition-all ${
                      fieldErrors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {fieldErrors.last_name && (
                  <p className="text-[10px] text-red-500 mt-1">{fieldErrors.last_name[0]}</p>
                )}
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="user@example.com"
                  dir="ltr"
                  className={`w-full bg-[#F8F9FA] border rounded-xl pr-9 pl-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3B2D]/20 focus:border-[#0B3B2D]/30 focus:bg-white transition-all text-left ${
                    fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[10px] text-red-500 mt-1">{fieldErrors.email[0]}</p>
              )}
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className={`w-full bg-[#F8F9FA] border rounded-xl pr-9 pl-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3B2D]/20 focus:border-[#0B3B2D]/30 focus:bg-white transition-all ${
                    fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-[10px] text-red-500 mt-1">{fieldErrors.password[0]}</p>
              )}
            </div>

            {/* الخصم الأقصى */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                الخصم الأقصى (%)
              </label>
              <div className="relative">
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="max_discount"
                  value={formData.max_discount}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  placeholder="40"
                  className={`w-full bg-[#F8F9FA] border rounded-xl pr-9 pl-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3B2D]/20 focus:border-[#0B3B2D]/30 focus:bg-white transition-all ${
                    fieldErrors.max_discount ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {fieldErrors.max_discount && (
                <p className="text-[10px] text-red-500 mt-1">{fieldErrors.max_discount[0]}</p>
              )}
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-l from-[#0B3B2D] to-[#135c47] hover:shadow-lg hover:shadow-[#0B3B2D]/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الإضافة...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>إضافة المستخدم</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}