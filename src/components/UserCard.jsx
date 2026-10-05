import React, { useState } from 'react';
import API from '../services/api';
import { Mail, Percent, Trash2, Loader2 } from 'lucide-react';

export default function UserCard({ user, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const initial = user?.first_name?.charAt(0)?.toUpperCase() || 
                  user?.last_name?.charAt(0)?.toUpperCase() || 
                  '؟';

  // حذف المستخدم
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/deleteUser?id=${user.id}`);
      onDelete?.(user.id);
    } catch (err) {
      console.error('خطأ deleteUser:', err.response?.status, err.response?.data);
      alert(`فشل الحذف: ${err.response?.data?.message || err.response?.status || 'خطأ غير معروف'}`);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      {/* ============ البطاقة ============ */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(11,59,45,0.04)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/30 transition-all duration-300 group overflow-hidden">
        
        {/* شريط علوي ملون */}
        <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-l from-[#0B3B2D] via-[#D4AF37] to-[#0B3B2D] scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500"></div>

        {/* توهج خلفي */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative">
          
          {/* الصف الأول */}
          <div className="flex items-start justify-between gap-3 mb-4">
            
            <div className="flex items-center gap-3 min-w-0 flex-1">
              
              {/* الصورة الرمزية */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg font-serif bg-[#0B3B2D]/5 text-[#0B3B2D] group-hover:bg-[#0B3B2D] group-hover:text-[#D4AF37] transition-all duration-300 group-hover:scale-105">
                  {initial}
                </div>
              </div>

              {/* الاسم + البريد */}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base leading-tight truncate text-gray-800 group-hover:text-[#0B3B2D] transition-colors duration-300">
                  {user?.first_name} {user?.last_name}
                </h3>
                
                <div className="flex items-center gap-1.5 mt-1.5 text-gray-400">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate text-[11px] font-medium" dir="ltr">
                    {user?.email || 'لا يوجد بريد'}
                  </span>
                </div>
              </div>
            </div>

            {/* شارة الخصم */}
            <div className="flex-shrink-0 px-3 py-2 rounded-2xl text-center min-w-[70px] bg-gradient-to-br from-[#D4AF37]/15 to-[#D4AF37]/5 border border-[#D4AF37]/25 group-hover:shadow-[0_4px_12px_rgba(212,175,55,0.2)] transition-shadow duration-300">
              <div className="flex items-center justify-center gap-0.5 mb-0.5">
                <Percent className="w-3 h-3 text-[#D4AF37]" />
                <span className="block text-[9px] text-gray-500 font-medium tracking-wide">الخصم الأقصى</span>
              </div>
              <span className="text-base font-bold leading-none text-[#0B3B2D]">
                {user?.max_discount ?? 0}%
              </span>
            </div>
          </div>

          {/* ============ زر الحذف ============ */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف المستخدم</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============ Modal تأكيد الحذف ============ */}
      {confirmDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setConfirmDelete(false)}
          dir="rtl"
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-[slideUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2">
                تأكيد الحذف
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                هل أنت متأكد من حذف <span className="font-bold text-gray-700">{user?.first_name} {user?.last_name}</span>؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes للأنيميشن */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}