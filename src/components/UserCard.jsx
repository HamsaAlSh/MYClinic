import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import API from '../services/api';
import { useLocale } from '../localization/LocaleProvider';
import {
  Mail, Percent, Trash2, Loader2, X, Wallet,
  TrendingUp, Calendar, AlertCircle, BarChart3
} from 'lucide-react';

export default function UserCard({ user, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [earnings, setEarnings] = useState(null);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [errorEarnings, setErrorEarnings] = useState('');
  const { tr } = useLocale();

  const initial = user?.first_name?.charAt(0)?.toUpperCase() || 
                  user?.last_name?.charAt(0)?.toUpperCase() || 
                  '؟';

  // جلب الأرباح الشهرية
  useEffect(() => {
    if (!showModal) return;
    
    const fetchEarnings = async () => {
      setLoadingEarnings(true);
      setErrorEarnings('');
      try {
        const res = await API.get(`/getUserMonthlyEarnings?id=${user.id}`);
        setEarnings(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setErrorEarnings(tr('adminOnlyError'));
        } else {
          setErrorEarnings(tr('earningsError'));
        }
      } finally {
        setLoadingEarnings(false);
      }
    };
    
    fetchEarnings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, user.id]);

  // قفل التمرير عند فتح Modal
  useEffect(() => {
    if (showModal || confirmDelete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal, confirmDelete]);

  const handleDelete = async (e) => {
    e.stopPropagation();
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

  const openDeleteModal = (e) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const openDetailsModal = () => setShowModal(true);
  const closeDetailsModal = () => {
    setShowModal(false);
    setEarnings(null);
    setErrorEarnings('');
  };

  return (
    <>
      {/* ============ البطاقة ============ */}
      <div 
        onClick={openDetailsModal}
        className="relative bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(11,59,45,0.04)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/30 transition-all duration-300 group overflow-hidden cursor-pointer active:scale-[0.99]"
      >
        <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-l from-[#0B3B2D] via-[#D4AF37] to-[#0B3B2D] scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500"></div>
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg font-serif bg-[#0B3B2D]/5 text-[#0B3B2D] group-hover:bg-[#0B3B2D] group-hover:text-[#D4AF37] transition-all duration-300 group-hover:scale-105">
                  {initial}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base leading-tight truncate text-gray-800 group-hover:text-[#0B3B2D] transition-colors duration-300">
                  {user?.first_name} {user?.last_name}
                </h3>
                
                <div className="flex items-center gap-1.5 mt-1.5 text-gray-400">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate text-[11px] font-medium" dir="ltr">
                    {user?.email || tr('noEmail')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 px-3 py-2 rounded-2xl text-center min-w-[70px] bg-gradient-to-br from-[#D4AF37]/15 to-[#D4AF37]/5 border border-[#D4AF37]/25 group-hover:shadow-[0_4px_12px_rgba(212,175,55,0.2)] transition-shadow duration-300">
              <div className="flex items-center justify-center gap-0.5 mb-0.5">
                <Percent className="w-3 h-3 text-[#D4AF37]" />
                <span className="block text-[9px] text-gray-500 font-medium tracking-wide">{tr('maxDiscount')}</span>
              </div>
              <span className="text-base font-bold leading-none text-[#0B3B2D]">
                {user?.max_discount ?? 0}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={openDeleteModal}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{tr('deleteUser')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============ Modal عرض التفاصيل — عبر Portal ============ */}
      {showModal && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={closeDetailsModal}
          dir="rtl"
        >
          <div 
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-[slideUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="relative flex items-center justify-between p-6 bg-gradient-to-l from-[#0B3B2D] to-[#135c47] text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-xl font-serif">
                  {initial}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5" dir="ltr">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={closeDetailsModal}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              
              {loadingEarnings ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0B3B2D] mb-3" />
                  <p className="text-xs text-gray-400">{tr('loadingEarnings')}</p>
                </div>
              ) : errorEarnings ? (
                <div className="bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-2xl text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorEarnings}</span>
                </div>
              ) : earnings ? (
                <>
                  <div className="bg-gradient-to-br from-[#0B3B2D] to-[#135c47] rounded-2xl p-5 text-white mb-5 relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/60 mb-1">{tr('totalCommission')}</p>
                        <p className="text-3xl font-bold font-serif">
                          {earnings.total_commission ?? 0}
                          <span className="text-sm font-normal text-[#D4AF37] mx-1">{tr('currency')}</span>
                        </p>
                        <p className="text-[10px] text-white/50 mt-1" dir="ltr">
                          {earnings.user_name}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                      <h4 className="text-sm font-bold text-gray-800">{tr('monthlyDistribution')}</h4>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {earnings.report?.length || 0} {tr('month')}
                      </span>
                    </div>

                    {earnings.report?.length ? (
                      <div className="space-y-2">
                        {earnings.report.map((month, i) => (
                          <div 
                            key={i} 
                            className="bg-[#F8F9FA] rounded-xl p-4 hover:bg-[#0B3B2D]/5 transition-colors group/month"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C] flex items-center justify-center shadow-sm">
                                  <Calendar className="w-5 h-5 text-[#041a14]" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-[#0B3B2D] font-serif">
                                    {month.month}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    {month.transaction_count} {tr('transaction')}
                                  </p>
                                </div>
                              </div>

                              <div className="text-left">
                                <p className="text-base font-bold text-green-600">
                                  +{month.total_commission} <span className="text-[10px]">{tr('currency')}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                          <TrendingUp className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-xs text-gray-400">
                          {earnings.message || tr('noTransactions')}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ============ Modal تأكيد الحذف — عبر Portal ============ */}
      {confirmDelete && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
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
                {tr('confirmDelete')}
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                {tr('confirmDeleteDesc')}{' '}
                <span className="font-bold text-gray-700">
                  {user?.first_name} {user?.last_name}
                </span>
                {' '}{tr('confirmDeleteNote')}
              </p>
              
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {tr('cancel')}
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
                      <span>{tr('delete')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

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