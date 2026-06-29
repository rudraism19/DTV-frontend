import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Target, BookOpen, LogOut, Menu, X, Bell, Brain, ShieldCheck, Settings, Shield } from 'lucide-react';
import { fetchStudentData, subscribeToLiveStream } from '../services/apiService';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [notificationsList, setNotificationsList] = useState([]);
  const [liveToast, setLiveToast] = useState(null);
  const [studentInfo, setStudentInfo] = useState({
    name: 'Kumar Kartikey',
    linkCode: localStorage.getItem('studentCode') || 'FC0D52'
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const studentCode = localStorage.getItem('studentCode') || 'FC0D52';
        const result = await fetchStudentData(studentCode);
        if (result && result.studentInfo) {
          setStudentInfo(result.studentInfo);
        }
        if (result && result.notifications) {
          setNotificationsList(result.notifications);
          setUnreadCount(result.notifications.filter(n => !n.is_read).length || 2);
        }
      } catch (err) {
        console.error('Failed to load student info in layout', err);
      }
    };
    loadData();

    // Subscribe to real-time SSE stream
    const unsubscribe = subscribeToLiveStream((message) => {
      if (message.type !== 'CONNECTED') {
        const title = `Live Update: ${message.type}`;
        const desc = message.data?.message || message.data?.title || JSON.stringify(message.data);
        
        setLiveToast({ title, desc, time: new Date().toLocaleTimeString() });
        setUnreadCount(prev => prev + 1);
        setNotificationsList(prev => [
          { id: Date.now(), title, message: desc, created_at: new Date().toISOString(), is_read: false },
          ...prev
        ]);

        // Auto hide toast after 5s
        setTimeout(() => setLiveToast(null), 5000);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('parentToken');
    localStorage.removeItem('studentCode');
    navigate('/login');
  };

  const navItems = [
    { name: 'Summary & Routine', path: '/dashboard/summary', icon: <Calendar size={20} /> },
    { name: 'Goals & Career', path: '/dashboard/goals', icon: <Target size={20} /> },
    { name: 'Study & Academics', path: '/dashboard/academics', icon: <BookOpen size={20} /> },
    { name: 'AI Behavioral Profile', path: '/dashboard/behavior', icon: <Brain size={20} /> },
    { name: 'Settings & Alerts', path: '/dashboard/settings', icon: <Settings size={20} /> },
    { name: 'Admin Management', path: '/dashboard/admin', icon: <Shield size={20} /> },
  ];

  const studentName = studentInfo.name || 'Kumar Kartikey';
  const firstName = studentName.split(' ')[0];
  const initials = studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const linkCode = studentInfo.linkCode || localStorage.getItem('studentCode') || 'FC0D52';

  return (
    <div className="flex h-screen bg-bg overflow-hidden relative">
      {/* Background Mesh Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Real-Time Live Toast Alert */}
      {liveToast && (
        <div className="fixed top-24 right-6 z-50 glass-panel border border-orange-500/40 p-4 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.3)] max-w-sm animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Broadcast
            </span>
            <button onClick={() => setLiveToast(null)} className="text-text-muted hover:text-white">
              <X size={16} />
            </button>
          </div>
          <p className="text-sm font-bold text-white">{liveToast.title}</p>
          <p className="text-xs text-text-muted mt-1">{liveToast.desc}</p>
          <p className="text-[10px] text-text-muted mt-2">{liveToast.time}</p>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col glass-panel border-r border-white/5 relative z-10">
        <div className="p-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">Digital<span className="text-orange-400">Twin</span> Verse</div>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-bold">Parent Portal</p>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              {initials}
            </div>
            <div>
              <p className="text-sm text-text-muted">Monitoring</p>
              <p className="text-white font-bold">{studentName}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
            <ShieldCheck size={14} />
            Securely Linked ({linkCode})
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-orange-600/20 text-orange-400 font-bold border border-orange-500/30 shadow-[inset_0_0_20px_rgba(249,115,22,0.1)]' 
                    : 'text-text-muted hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <span className={`mr-3 ${isActive ? 'text-orange-400' : 'text-text-muted'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium hover:scale-[1.02] active:scale-95"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-6 lg:px-10 relative z-50">
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-white hover:bg-white/10 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="text-xl font-bold text-white ml-4 tracking-tight">Digital<span className="text-orange-400">Twin</span> Verse</div>
          </div>
          
          <div className="hidden lg:block">
            {/* Header left empty for clean UI */}
          </div>

          <div className="flex items-center gap-4 relative">
            <button 
              className="p-2.5 text-text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 glass-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <h3 className="text-white font-bold">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => setUnreadCount(0)}
                      className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notificationsList.length > 0 ? (
                    notificationsList.map(n => (
                      <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                        <p className="text-sm text-white font-medium mb-1">🔔 {n.title}</p>
                        <p className="text-xs text-text-muted">{n.message}</p>
                        <p className="text-[10px] text-text-muted mt-2">{new Date(n.created_at).toLocaleTimeString()}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                        <p className="text-sm text-white font-medium mb-1">🔥 10-Day Streak Reached!</p>
                        <p className="text-xs text-text-muted">{firstName} has successfully logged in and studied for 10 consecutive days.</p>
                        <p className="text-[10px] text-text-muted mt-2">2 hours ago</p>
                      </div>
                      <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                        <p className="text-sm text-white font-medium mb-1">⚠️ Subject Time Imbalance</p>
                        <p className="text-xs text-text-muted">{firstName} spent 420 mins on Computer Sci but only 120 mins on English. AI has adjusted the schedule.</p>
                        <p className="text-[10px] text-text-muted mt-2">Yesterday</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-3 text-center bg-white/5">
                  <Link to="/dashboard/settings" onClick={() => setShowNotifications(false)} className="text-xs text-text-muted hover:text-white transition-colors">
                    Manage Alert Preferences
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-72 glass-panel border-r border-white/10 flex flex-col">
            <div className="p-6 flex items-center justify-between">
              <div className="text-2xl font-bold text-white tracking-tight">Digital<span className="text-orange-400">Twin</span> Verse</div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:bg-white/10 p-2 rounded-lg">
                <X size={24} />
              </button>
            </div>
            
            <div className="px-6 py-2 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
                <ShieldCheck size={14} />
                Securely Linked ({linkCode})
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname.includes(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-orange-600/20 text-orange-400 font-bold border border-orange-500/30' 
                        : 'text-text-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowLogoutModal(true);
                }}
                className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium hover:scale-[1.02] active:scale-95"
              >
                <LogOut size={20} className="mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
          <div className="glass-panel border border-white/10 rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-2">Sign Out</h3>
            <p className="text-sm text-text-muted mb-6">Are you sure you want to sign out of the Parent Portal? You will need your student link code to log back in.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
