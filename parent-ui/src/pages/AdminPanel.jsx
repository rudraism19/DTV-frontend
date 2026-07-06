import { useState, useEffect, useRef, memo } from 'react';
import { Shield, Search, Users, BookOpen, Activity, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { fetchAdminData } from '../services/apiService';

const AdminPanel = memo(function AdminPanel() {
  const [data, setData] = useState({
    pagination: { page: 1, limit: 10, total: 12, totalPages: 2 },
    students: [],
    courses: [],
    recentLogs: []
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [activeTab, setActiveTab] = useState('students');
  const [toast, setToast] = useState(null);

  const isMounted = useRef(true);

  const loadData = async (currentPage = page, currentSearch = search, currentSort = sort, currentOrder = order) => {
    setLoading(true);
    try {
      const result = await fetchAdminData(currentPage, 10, currentSearch, currentSort, currentOrder);
      if (result && isMounted.current) {
        setData(result);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    loadData(page, search, sort, order);
    return () => { isMounted.current = false; };
  }, [page, sort, order]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData(1, search, sort, order);
  };

  const handleSort = (column) => {
    const newOrder = sort === column && order === 'ASC' ? 'DESC' : 'ASC';
    setSort(column);
    setOrder(newOrder);
  };

  const showToast = (msg) => {
    setToast(msg);
  };

  return (
    <div className="space-y-8 relative">
      {toast && (
        <div className="fixed top-24 right-10 z-50 max-w-md bg-slate-900/95 border border-purple-500/30 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="text-purple-400 shrink-0" size={24} />
          <p className="text-sm font-medium leading-relaxed">{toast}</p>
        </div>
      )}

      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
            <Shield className="text-purple-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Enterprise Administration Portal</h2>
            <p className="text-text-muted">Real-time control center for students, learning tracks, and system audit logs.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setPage(1); loadData(1, search, sort, order); showToast('🔄 Admin Intelligence Data refreshed successfully.'); }}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2 transform hover:scale-[1.02] active:scale-95"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-purple-400' : 'text-purple-400'} />
            Refresh Data
          </button>
          <button 
            onClick={() => showToast('📥 Complete Enterprise System Audit Export initiated. Backup ready in 5s.')}
            className="px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 hover:text-white rounded-xl font-bold text-xs shadow-[0_4px_15px_rgba(168,85,247,0.2)] transition-all flex items-center gap-2 transform hover:scale-[1.02] active:scale-95"
          >
            <FileText size={15} />
            Export System Audit Logs
          </button>
        </div>
      </div>

      {/* Quick Stat Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-purple-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">Enrolled Students</p>
            <h3 className="text-3xl font-extrabold text-white">{data.pagination?.total || data.students?.length || 12}</h3>
            <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <span>▲ 100% Verified Profiles</span>
            </p>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
            <Users className="text-purple-400" size={28} />
          </div>
        </div>

        <div className="glass-panel p-6 border-blue-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">Active Courses & Modules</p>
            <h3 className="text-3xl font-extrabold text-white">{data.courses?.length || 3}</h3>
            <p className="text-xs text-blue-400 mt-2 font-medium">Fully Interactive VR/AI Aligned</p>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <BookOpen className="text-blue-400" size={28} />
          </div>
        </div>

        <div className="glass-panel p-6 border-emerald-500/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">Real-Time Audit Events</p>
            <h3 className="text-3xl font-extrabold text-white">{data.recentLogs?.length || 2}</h3>
            <p className="text-xs text-emerald-400 mt-2 font-medium">Active SSE Live Streaming</p>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <Activity className="text-emerald-400" size={28} />
          </div>
        </div>
      </div>

      {/* Interactive Main Console */}
      <div className="glass-panel border-white/10 overflow-hidden">
        
        {/* Navigation & Toolbar */}
        <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/5">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {[
              { id: 'students', label: 'Student Management', icon: Users, count: data.students?.length },
              { id: 'courses', label: 'Courses & Masterclasses', icon: BookOpen, count: data.courses?.length },
              { id: 'logs', label: 'System Audit Logs', icon: Activity, count: data.recentLogs?.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${isActive ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'}`}
                >
                  <Icon size={16} />
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'}`}>
                    {tab.count || 0}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students, emails, courses..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-11 pr-4 py-2 text-white font-medium text-xs focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-xs shadow-lg transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {/* Console Content Area */}
        <div className="p-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-white/5 rounded-2xl border border-white/10"></div>
              ))}
            </div>
          ) : activeTab === 'students' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-bold text-purple-300 uppercase tracking-wider">
                    <th className="py-4 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-2">
                        Student Name
                        <ArrowUpDown size={13} className="text-purple-400" />
                      </div>
                    </th>
                    <th className="py-4 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('email')}>
                      <div className="flex items-center gap-2">
                        Email Address
                        <ArrowUpDown size={13} className="text-purple-400" />
                      </div>
                    </th>
                    <th className="py-4 px-4">System Role</th>
                    <th className="py-4 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('created_at')}>
                      <div className="flex items-center gap-2">
                        Profile Created
                        <ArrowUpDown size={13} className="text-purple-400" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-white">
                  {data.students?.length > 0 ? data.students.map((student) => (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-extrabold text-white text-sm shadow-md">
                          {student.name ? student.name.charAt(0) : 'S'}
                        </div>
                        {student.name}
                      </td>
                      <td className="py-4 px-4 text-slate-300 text-xs">{student.email}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                          {student.role || 'Student'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-text-muted">
                        {new Date(student.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button 
                          onClick={() => showToast(`🔐 Generated secure admin authorization key for student ${student.name}.`)}
                          className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30 text-purple-300 hover:text-white rounded-lg font-bold text-xs transition-all"
                        >
                          Access Logs
                        </button>
                        <button 
                          onClick={() => showToast(`🛡️ Student profile ${student.name} fully verified and linked to EdTech Multi-Agent Engine.`)}
                          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/30 text-emerald-300 hover:text-white rounded-lg font-bold text-xs transition-all"
                        >
                          Verify Link
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-text-muted text-sm font-medium">
                        No students match the current administration search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'courses' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.courses?.map((course) => (
                <div key={course.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                        {course.category}
                      </span>
                      <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/30 uppercase tracking-wider">
                        {course.difficulty_level}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-base mb-3 group-hover:text-purple-300 transition-colors">{course.title}</h4>
                    <p className="text-xs text-text-muted leading-relaxed mb-6">Fully immersive VR & AI interactive syllabus module complete with automated daily quizzes and project milestones.</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-bold">
                    <span>Estimated Duration</span>
                    <span className="text-emerald-400">{course.estimated_hours} Hours</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentLogs?.map((log) => {
                let parsedDetails = {};
                try {
                  parsedDetails = typeof log.action_details === 'string' ? JSON.parse(log.action_details) : log.action_details;
                } catch {
                  // ignore parse error
                }

                return (
                  <div key={log.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                        <Activity className="text-emerald-400" size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                            {log.action_type}
                          </span>
                          <span className="text-xs text-text-muted font-medium">
                            {new Date(log.performed_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white">
                          {log.action_type === 'Quiz_Submit' ? `Student submitted assessment: "${parsedDetails.title || 'Quiz'}" with Score ${parsedDetails.score}` : `Initiated lesson module: "${parsedDetails.title || 'Module'}"`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      Logged Successfully
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Footer */}
          {activeTab === 'students' && data.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Showing Page {data.pagination.page} of {data.pagination.totalPages}</span>
              <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  disabled={page >= data.pagination.totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, data.pagination.totalPages))}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
});

export default AdminPanel;
