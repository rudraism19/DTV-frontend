import { CheckCircle2, Circle, Clock, Target, TrendingUp, Loader2, User, Key, Calendar, Zap } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useState, useEffect } from 'react';
import { fetchStudentData } from '../services/apiService';

export default function SummaryRoutine() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const studentCode = localStorage.getItem('studentCode') || 'DEMO-123';
        const result = await fetchStudentData(studentCode);
        setData(result);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const routine = [
    { time: '08:00 AM', task: 'Logic Quiz (Math)', status: 'completed' },
    { time: '10:30 AM', task: 'AI Coding Assessment', status: 'completed' },
    { time: '02:00 PM', task: 'Physics VR Module', status: 'in-progress' },
    { time: '04:00 PM', task: 'Review AI Feedback', status: 'pending' }
  ];

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  const weeklyData = data.weeklyData || [];
  const studentInfo = data.studentInfo || {};
  const recentActivities = data.recentActivities || [];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Weekly Summary & Routine</h1>
        <p className="text-blue-200">Real-time database analytics and live student engagement tracking</p>
      </div>

      {/* Student Database Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 group">
          <div className="p-3.5 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <User size={24} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Student Profile</h3>
            <p className="text-lg font-bold text-white tracking-tight mt-0.5">{studentInfo.name || 'Kumar Kartikey'}</p>
            <p className="text-xs text-green-400 font-medium mt-1">● {studentInfo.status || 'Active'}</p>
          </div>
        </div>

        <div className="glass-panel p-6 border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 group">
          <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Key size={24} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Secure Link Code</h3>
            <p className="text-lg font-bold text-white tracking-tight mt-0.5">{studentInfo.linkCode || 'FC0D52'}</p>
            <p className="text-xs text-emerald-300 font-medium mt-1">Direct DB Pairing</p>
          </div>
        </div>

        <div className="glass-panel p-6 border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 group">
          <div className="p-3.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Last Activity</h3>
            <p className="text-sm font-bold text-white tracking-tight mt-0.5">
              {new Date(studentInfo.lastLoginAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-purple-300 font-medium mt-1">Real-time sync</p>
          </div>
        </div>

        <div className="glass-panel p-6 border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 group">
          <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Goal Accuracy</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-white tracking-tight">88%</span>
              <span className="text-xs text-green-400 flex items-center font-bold"><TrendingUp size={14} className="mr-0.5"/> +5%</span>
            </div>
            <p className="text-xs text-blue-300 font-medium mt-1">Multi-agent evaluated</p>
          </div>
        </div>
      </div>

      {/* Next Step Achievement Banner */}
      <div className="glass-panel p-8 border-orange-500/30 relative overflow-hidden group hover:border-orange-500/50 transition-all duration-300 shadow-[0_10px_30px_rgba(249,115,22,0.1)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[80px] group-hover:bg-orange-500/20 transition-all pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-orange-400 animate-pulse" />
              <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">Next Step Achievement</h3>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Complete Advanced React Certification</h2>
            <p className="text-sm text-blue-200">This will boost Career Matching by 15% for the Software Architect role.</p>
          </div>
          <button 
            onClick={() => setShowRoadmapModal(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(249,115,22,0.3)] whitespace-nowrap"
          >
            View AI Career Roadmap
          </button>
        </div>
      </div>

      {/* Main Charts & Routine Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Progress Summary */}
        <div className="lg:col-span-2 glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Weekly Progress Summary</h3>
            <div className="min-h-[300px] h-[300px] sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,13,20,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="focus" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" name="Focus Level" />
                  <Area type="monotone" dataKey="goalCompletion" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGoals)" name="Goals Hit" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Daily Routine Planner */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Daily Routine</h3>
              <Clock size={18} className="text-blue-400" />
            </div>
            <div className="space-y-6">
              {routine.map((item, idx) => (
                <div key={idx} className="flex gap-4 relative group">
                  {idx !== routine.length - 1 && (
                    <div className="absolute left-2.5 top-6 bottom-[-20px] w-px bg-white/10 group-hover:bg-orange-500/30 transition-colors"></div>
                  )}
                  <div className="flex-shrink-0 mt-1">
                    {item.status === 'completed' ? (
                      <CheckCircle2 size={20} className="text-green-400 bg-bg rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                    ) : item.status === 'in-progress' ? (
                      <Circle size={20} className="text-orange-400 fill-orange-400/20 bg-bg rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
                    ) : (
                      <Circle size={20} className="text-white/30 bg-bg rounded-full" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${item.status === 'completed' ? 'text-white/60 line-through' : 'text-white'}`}>{item.task}</h4>
                    <p className="text-xs text-text-muted mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Live Activities */}
      <div className="glass-panel p-6 border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Recent Real-time Student Activities</h3>
          <span className="text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg animate-pulse">
            ● Live Sync
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentActivities.map((act, idx) => (
            <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">
                    {act.type}
                  </span>
                  <span className="text-xs text-text-muted">{act.time}</span>
                </div>
                <h4 className="text-white font-bold text-base group-hover:text-orange-300 transition-colors">{act.title}</h4>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium">Performance Result</span>
                <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20">{act.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap Modal */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowRoadmapModal(false)}></div>
          <div className="glass-panel border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header & AI Analysis */}
            <div className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex-shrink-0 rounded-t-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                      <Target size={24} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">React Certification</h2>
                  </div>
                  <p className="text-blue-200 text-sm">Strategic path designed by AI for Software Architect role.</p>
                </div>

                <div className="flex gap-4">
                  <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-center min-w-[100px]">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">AI Confidence</p>
                    <p className="text-green-400 font-bold text-lg">94%</p>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-center min-w-[100px]">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">Est. Completion</p>
                    <p className="text-white font-bold text-lg">12 Days</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8 relative z-10">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-white">Overall Progress</span>
                  <span className="text-orange-400">45%</span>
                </div>
                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full w-[45%] shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                </div>
              </div>
            </div>

            {/* Scrollable Timeline */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-green-500/50 before:via-orange-500/50 before:to-white/10">
                
                {/* Step 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-8">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border border-green-500/20 bg-green-500/5 transition-all hover:bg-green-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">React Fundamentals</h3>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-md font-bold">Completed</span>
                    </div>
                    <p className="text-sm text-text-muted mb-4">Mastered JSX, Props, Component Lifecycle, and basic event handling.</p>
                    <div className="flex gap-2">
                      <span className="text-[10px] px-2 py-1 bg-white/5 text-gray-300 rounded border border-white/5">Score: 98%</span>
                      <span className="text-[10px] px-2 py-1 bg-white/5 text-gray-300 rounded border border-white/5">Time: 12h</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-8">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border border-green-500/20 bg-green-500/5 transition-all hover:bg-green-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">Advanced Hooks</h3>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-md font-bold">Completed</span>
                    </div>
                    <p className="text-sm text-text-muted mb-4">Deep dive into useEffect, useMemo, useCallback, and creating Custom Hooks.</p>
                    <div className="flex gap-2">
                      <span className="text-[10px] px-2 py-1 bg-white/5 text-gray-300 rounded border border-white/5">Score: 92%</span>
                      <span className="text-[10px] px-2 py-1 bg-white/5 text-gray-300 rounded border border-white/5">Time: 18h</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 (Current) */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-8">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-orange-500 bg-bg text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                    <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border border-orange-500/40 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.05)]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">Architecture & State</h3>
                      <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md font-bold animate-pulse">In Progress</span>
                    </div>
                    <p className="text-sm text-blue-200 mb-4">Implementing scalable Redux slices and Context API patterns in a real-world e-commerce module.</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[60%]"></div>
                      </div>
                      <span className="text-xs text-orange-400 font-bold">60%</span>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-8">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/10 bg-bg text-text-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border border-white/5 bg-white/5 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">Performance Tuning</h3>
                      <span className="text-xs px-2 py-1 bg-black/40 text-text-muted rounded-md font-bold">Locked</span>
                    </div>
                    <p className="text-sm text-text-muted">Mastering React.memo, lazy loading, and avoiding unnecessary re-renders.</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/10 bg-bg text-text-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                    <Target size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border border-white/5 bg-white/5 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">Final Assessment Exam</h3>
                      <span className="text-xs px-2 py-1 bg-black/40 text-text-muted rounded-md font-bold">Locked</span>
                    </div>
                    <p className="text-sm text-text-muted">Pass the 4-hour practical coding assessment evaluated by AI.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20 rounded-b-2xl flex justify-end flex-shrink-0">
              <button 
                onClick={() => setShowRoadmapModal(false)}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all active:scale-95 border border-white/10"
              >
                Close Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
