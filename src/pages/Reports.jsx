import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import LocaleToggle from '../components/LocaleToggle';
import { useLocale } from '../localization/LocaleProvider';
import logo from '../assets/MYClinicLogo.jpg';
import {
  ArrowRight, LogOut, Loader2, AlertCircle, RefreshCw,
  TrendingUp, Calendar, Wallet, BarChart3, Search
} from 'lucide-react';

export default function Reports() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { tr } = useLocale();

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/getMonthlyEarningsReport');
      setReport(res.data.report || []);
    } catch (err) {
      setError(tr('reportLoadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const grandTotal = report.reduce((sum, month) => {
    return sum + (month.users?.reduce((s, u) => s + (u.total_commission || 0), 0) || 0);
  }, 0);

  const totalTransactions = report.reduce((sum, month) => {
    return sum + (month.users?.reduce((s, u) => s + (u.transaction_count || 0), 0) || 0);
  }, 0);

  const filteredReport = report.filter(month => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      month.month?.toLowerCase().includes(term) ||
      month.users?.some(u => u.user_name?.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative overflow-hidden">
      
      {/* خلفية زخرفية */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#0B3B2D]/5 rounded-full blur-3xl z-0"></div>
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl z-0"></div>

      {/* الشريط العلوي */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-10 px-8 py-4 flex items-center justify-between shadow-sm">
        
        <div className="flex items-center gap-3 group cursor-default">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-[#D4AF37]/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src={logo} 
              alt="My Clinics Logo" 
              className="relative w-11 h-11 object-contain rounded-xl ring-1 ring-gray-100 group-hover:ring-[#D4AF37]/40 transition-all duration-300" 
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-lg font-bold text-[#0B3B2D] tracking-wider leading-tight">
              {tr('appName')}
            </h1>
            <p className="text-[11px] text-gray-400 font-medium leading-tight mt-0.5">
              {tr('reportsSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LocaleToggle />

          <button
            onClick={() => navigate('/home')}
            className="group flex items-center gap-2 text-xs font-semibold text-[#0B3B2D] bg-[#0B3B2D]/5 hover:bg-[#0B3B2D] hover:text-white px-4 py-2.5 rounded-xl transition-all duration-300 active:scale-95"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span>{tr('backToUsers')}</span>
          </button>

          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-4 py-2.5 rounded-xl transition-all duration-300 active:scale-95"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>{tr('logout')}</span>
          </button>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto p-8">
        
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#D4AF37]" />
              {tr('monthlyEarningsReports')}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {tr('monthlyEarningsReportsDesc')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={tr('searchPlaceholder')}
                className="bg-white border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3B2D]/20 focus:border-[#0B3B2D]/30 transition-all w-64"
              />
            </div>

            <button
              onClick={fetchReport}
              disabled={loading}
              className="group bg-white border border-gray-200 hover:border-[#0B3B2D] text-[#0B3B2D] hover:bg-[#0B3B2D] hover:text-white p-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
              title={tr('refreshData')}
            >
              <RefreshCw className={`w-4 h-4 transition-transform ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            </button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          <div className="bg-gradient-to-br from-[#0B3B2D] to-[#135c47] rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60 mb-1">{tr('totalEarnings')}</p>
                <p className="text-3xl font-bold font-serif">
                  {grandTotal.toLocaleString()}
                  <span className="text-sm font-normal text-[#D4AF37] mx-1">{tr('currency')}</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">{tr('totalTransactions')}</p>
                <p className="text-3xl font-bold text-[#0B3B2D]">{totalTransactions}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#0B3B2D]/5 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#0B3B2D]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">{tr('monthsCount')}</p>
                <p className="text-3xl font-bold text-[#0B3B2D]">{report.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-[#0B3B2D]/20 rounded-full blur-xl animate-pulse"></div>
              <Loader2 className="relative w-8 h-8 animate-spin text-[#0B3B2D] mb-3" />
            </div>
            <p className="text-xs text-gray-400 mt-3 animate-pulse">{tr('loadingReport')}</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchReport}
              className="text-red-700 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 text-[11px]"
            >
              {tr('retry')}
            </button>
          </div>
        ) : filteredReport.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-[#0B3B2D]/5 rounded-2xl flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-[#0B3B2D]/40" />
            </div>
            <p className="text-sm font-semibold text-gray-600">
              {searchTerm ? tr('noResults') : tr('noData')}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm ? tr('noResultsDesc') : tr('noDataDesc')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReport.map((month, monthIndex) => {
              const monthTotal = month.users?.reduce(
                (s, u) => s + (u.total_commission || 0), 0
              ) || 0;

              return (
                <div
                  key={monthIndex}
                  className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(11,59,45,0.04)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.1)] hover:border-[#D4AF37]/30 transition-all duration-300 group overflow-hidden animate-[fadeInUp_0.4s_ease-out_both]"
                  style={{ animationDelay: `${monthIndex * 60}ms` }}
                >
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C] flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-[#041a14]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#0B3B2D] font-serif">
                          {month.month}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {month.users?.length || 0} {tr('usersCount')}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#0B3B2D] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <Wallet className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{tr('monthTotalLabel')}: {monthTotal} {tr('currency')}</span>
                    </div>
                  </div>

                  {month.users?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {month.users.map((u, userIndex) => (
                        <div
                          key={userIndex}
                          className="bg-[#F8F9FA] rounded-2xl p-4 hover:bg-[#0B3B2D]/5 transition-colors group/user"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-[#0B3B2D]/5 flex items-center justify-center text-[#0B3B2D] font-bold text-sm font-serif group-hover/user:bg-[#0B3B2D] group-hover/user:text-[#D4AF37] transition-all">
                                {u.user_name?.charAt(0)?.toUpperCase() || '؟'}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-800 truncate">
                                  {u.user_name}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  ID: #{u.user_id}
                                </p>
                              </div>
                            </div>

                            <div className="text-left flex-shrink-0">
                              <p className="text-sm font-bold text-green-600">
                                +{u.total_commission} <span className="text-[10px]">{tr('currency')}</span>
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {u.transaction_count} {tr('transaction')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-xs text-gray-400 py-4">
                      {tr('noUsersInMonth')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}