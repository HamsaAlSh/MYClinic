import React, { useState } from 'react';
import API from '../services/api';
import { useLocale } from '../localization/LocaleProvider';
import { 
  X, Code2, Coins, Loader2, AlertCircle, 
  CheckCircle2, Percent, Wallet, User, 
  Receipt, TrendingUp, Hash, Ticket
} from 'lucide-react';

export default function VerifyCodeModal({ isOpen, onClose }) {
  const [code, setCode] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const { tr } = useLocale();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await API.get('/verifyAndCalculateCode', {
        params: {
          code: code,
          total_amount: totalAmount,
        },
      });

      setResult(res.data?.data || res.data);
    } catch (err) {
      const msg = err.response?.data?.message 
               || err.response?.data?.error 
               || 'فشل في التحقق من الكود';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setTotalAmount('');
    setError('');
    setResult(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={handleClose}
      dir="rtl"
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-[#0B3B2D] via-[#D4AF37] to-[#0B3B2D]"></div>

        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C] flex items-center justify-center shadow-sm">
              <Ticket className="w-5 h-5 text-[#041a14]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">{tr('verifyCodeTitle')}</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">{tr('verifyCodeDesc')}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 pt-2">
          
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-[shake_0.4s_ease-out]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                  {tr('code')}
                </label>
                <div className="relative">
                  <Code2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder={tr('codePlaceholder')}
                    dir="ltr"
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl pr-9 pl-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 focus:bg-white transition-all text-left font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                  {tr('totalAmount')}
                </label>
                <div className="relative">
                  <Coins className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    required
                    min="1"
                    step="0.01"
                    placeholder="40"
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl pr-9 pl-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {tr('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#041a14] bg-gradient-to-l from-[#D4AF37] to-[#AA8C2C] hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{tr('verifying')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{tr('verifyAndCalc')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-3 py-2 rounded-xl text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">{tr('verifiedSuccess')}</span>
              </div>

              <div className="bg-gradient-to-br from-[#0B3B2D] to-[#135c47] rounded-2xl p-4 text-white relative overflow-hidden">
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#D4AF37]/20 rounded-full blur-2xl"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/60 mb-1">
                      <User className="w-3 h-3" />
                      <span>{tr('codeOwner')}</span>
                    </div>
                    <p className="text-sm font-bold">{result.user_name}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/60">
                      <Hash className="w-3 h-3" />
                      <span className="font-mono">{result.code}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#F8F9FA] rounded-2xl p-4 space-y-2.5">
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>{tr('totalAmount')}</span>
                  </div>
                  <span className="font-bold text-gray-800">{result.total_amount} {tr('currency')}</span>
                </div>

                <div className="h-[1px] bg-gray-200"></div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Percent className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{tr('discountPercent')}</span>
                  </div>
                  <span className="font-bold text-[#D4AF37]">{result.discount_percentage}%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                    <span>{tr('discountValue')}</span>
                  </div>
                  <span className="font-bold text-red-500">- {result.discount_value} {tr('currency')}</span>
                </div>

                <div className="h-[1px] bg-gray-200"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold">{tr('finalAmount')}</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{result.final_amount} {tr('currency')}</span>
                </div>
              </div>

              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl p-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Wallet className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{tr('userCommission')} ({result.user_commission_percentage}%)</span>
                  </div>
                  <span className="font-bold text-[#0B3B2D]">+ {result.user_commission} {tr('currency')}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                <Hash className="w-3 h-3" />
                <span>{tr('transactionId')}: {result.transaction_id}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setResult(null);
                    setCode('');
                    setTotalAmount('');
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#0B3B2D] bg-[#0B3B2D]/5 hover:bg-[#0B3B2D] hover:text-white transition-all"
                >
                  {tr('newCode')}
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-l from-[#0B3B2D] to-[#135c47] hover:shadow-lg transition-all"
                >
                  {tr('close')}
                </button>
              </div>
            </div>
          )}
        </div>
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}