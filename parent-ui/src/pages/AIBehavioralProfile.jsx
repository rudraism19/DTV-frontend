import { Brain, MessageSquare, Zap, Activity, AlertTriangle, CheckCircle2, Sliders, RefreshCw, HelpCircle, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts';
import { useState, useEffect, useRef, memo } from 'react';
import { fetchStudentData } from '../services/apiService';

const AIBehavioralProfile = memo(function AIBehavioralProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socraticMode, setSocraticMode] = useState(true);
  const [strictPrompting, setStrictPrompting] = useState(true);
  const [toast, setToast] = useState(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const loadData = async () => {
      try {
        const studentCode = localStorage.getItem('studentCode') || 'DEMO-123';
        const result = await fetchStudentData(studentCode);
        if (isMounted.current) setData(result);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (msg) => {
    setToast(msg);
  };

  if (loading || !data) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-1/3 mb-2"></div>
        <div className="h-6 bg-white/5 rounded-xl w-1/2 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 border-white/5 h-80"></div>
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 border-white/5 h-32"></div>
            <div className="glass-panel p-6 border-white/5 h-48"></div>
          </div>
        </div>
      </div>
    );
  }

  const aiAnalytics = data.aiAnalytics || {};
  const studentName = data.studentInfo?.name || 'Kumar Kartikey';
  const firstName = studentName.split(' ')[0];

  const behaviorData = [
    { subject: 'Productivity', A: aiAnalytics.productivityScore?.value || 92, fullMark: 100 },
    { subject: 'Consistency', A: aiAnalytics.consistencyScore?.value || 88, fullMark: 100 },
    { subject: 'Study Habit', A: aiAnalytics.studyHabitScore?.value || 94, fullMark: 100 },
    { subject: 'Time Mgmt', A: aiAnalytics.timeManagementScore?.value || 85, fullMark: 100 },
    { subject: 'Behavioral Index', A: aiAnalytics.behaviorScore?.value || 95, fullMark: 100 },
    { subject: 'Self-Reliance', A: 90, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 relative">
      {toast && (
        <div className="fixed top-24 right-10 z-50 max-w-md bg-slate-900/95 border border-purple-500/30 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="text-purple-400 shrink-0" size={24} />
          <p className="text-sm font-medium leading-relaxed">{toast}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-purple-500/20 rounded-2xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Brain className="text-purple-400 animate-pulse" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">AI Behavioral Profile</h2>
            <p className="text-blue-200 text-sm mt-0.5">Real-time analysis of how {firstName} interacts with the Digital Twin Verse AI Tutor</p>
          </div>
        </div>

        <button 
          onClick={() => showToast(`🔄 Recalibrating AI Models: Analyzing ${firstName}'s last 48 hours of prompt history and voice interactions...`)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-purple-300 rounded-xl font-bold text-xs transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm"
        >
          <RefreshCw size={16} />
          Recalibrate AI Model
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Chart */}
        <div className="lg:col-span-1 glass-panel border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)' }}></div>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Cognitive Traits</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                Multi-Agent Evaluated
              </span>
            </div>
            <div className="h-[280px] w-full my-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={behaviorData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontWeight: 600 }} 
                  />
                  <Radar name={studentName} dataKey="A" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 text-xs text-text-muted leading-relaxed space-y-2">
            <p>🟢 Behavioral Index and Productivity score in the top 10% among national peers in AI engagement.</p>
            <p className="text-purple-300"><strong>Why:</strong> {aiAnalytics.behaviorScore?.why || 'Consistently deep question formulation with excellent focus retention.'}</p>
          </div>
        </div>

        {/* AI Interaction Stats & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-panel border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.01] group">
              <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <MessageSquare size={26} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Questions Asked to AI</p>
                <p className="text-3xl font-bold text-white tracking-tight mt-0.5">1,248 <span className="text-sm font-normal text-green-400 ml-1">+12%</span></p>
                <p className="text-xs text-blue-300 font-medium mt-1">Interactive dialogue sessions</p>
              </div>
            </div>
            
            <div className="glass-panel border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.01] group">
              <div className="p-4 bg-orange-500/20 rounded-2xl border border-orange-500/30 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <Zap size={26} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Prompt Quality Score</p>
                <p className="text-3xl font-bold text-white tracking-tight mt-0.5">A- <span className="text-sm font-normal text-purple-300 ml-1">Excellent</span></p>
                <p className="text-xs text-orange-300 font-medium mt-1">High conceptual structuring</p>
              </div>
            </div>
          </div>

          {/* AI Metrics & WHY Rationale Accordeon/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/30 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-bold text-base">Productivity Score</h4>
                  <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20">
                    {aiAnalytics.productivityScore?.value || 92}%
                  </span>
                </div>
                <p className="text-xs text-blue-200 mb-4">Tracking active outputs vs allocated focus windows.</p>
              </div>
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                  <HelpCircle size={14} />
                  Why AI Scored This:
                </div>
                <p className="text-xs text-blue-200/90 leading-relaxed">{aiAnalytics.productivityScore?.why || 'Evaluated based on active problem solving execution without multi-tasking penalty.'}</p>
              </div>
            </div>

            <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/30 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-bold text-base">Consistency Rating</h4>
                  <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20">
                    {aiAnalytics.consistencyScore?.value || 88}%
                  </span>
                </div>
                <p className="text-xs text-blue-200 mb-4">Measurement of daily study streak stability and routine execution.</p>
              </div>
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                  <HelpCircle size={14} />
                  Why AI Scored This:
                </div>
                <p className="text-xs text-blue-200/90 leading-relaxed">{aiAnalytics.consistencyScore?.why || 'Minor weekend dropoff noted but excellent weekday adherence.'}</p>
              </div>
            </div>
          </div>

          {/* Interactive AI Persona & Moderation Tuners */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 border-purple-500/20">
            <div className="flex items-center gap-2 mb-6">
              <Sliders className="text-purple-400 animate-pulse" size={20} />
              <h3 className="text-lg font-bold text-white">Live AI Moderation & Tutoring Tuning</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">Socratic Tutoring Mode</h4>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    When active, the AI refuses to provide direct calculation answers and instead asks guiding questions to prompt self-discovery.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const newState = !socraticMode;
                    setSocraticMode(newState);
                    showToast(`🟢 Socratic Tutoring Mode is now ${newState ? 'ACTIVE' : 'INACTIVE'} for ${firstName}'s sessions.`);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${socraticMode ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)]' : 'bg-white/10 hover:bg-white/20 text-gray-300'}`}
                >
                  {socraticMode ? '🟢 Socratic Mode Active' : '⚪ Socratic Mode Inactive'}
                </button>
              </div>

              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">Strict Academic Prompting</h4>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    Ensures the AI filters out non-academic tangents and redirects {firstName} back to the active syllabus topics during scheduled hours.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const newState = !strictPrompting;
                    setStrictPrompting(newState);
                    showToast(`🟢 Strict Academic Prompting is now ${newState ? 'ACTIVE' : 'INACTIVE'} for ${firstName}'s routine.`);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${strictPrompting ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]' : 'bg-white/10 hover:bg-white/20 text-gray-300'}`}
                >
                  {strictPrompting ? '🟢 Strict Prompting Active' : '⚪ Strict Prompting Inactive'}
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Behavioral Alerts & Real-time Risks</h3>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                Risk Level: {aiAnalytics.learningRisk?.value || 'Low'}
              </span>
            </div>
            <div className="space-y-4">
              
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 flex gap-4 items-start hover:bg-white/10 transition-colors duration-300">
                <Activity className="text-green-400 mt-1 shrink-0" size={22} />
                <div>
                  <h4 className="text-white font-bold text-base mb-1">High Curiosity Indicator</h4>
                  <p className="text-sm text-text-muted leading-relaxed">{firstName} has been asking deep follow-up questions regarding Quantum Physics rather than accepting base answers. This indicates strong critical thinking.</p>
                </div>
              </div>

              <div className="p-5 bg-orange-500/10 rounded-2xl border border-orange-500/20 flex gap-4 items-start hover:border-orange-500/30 transition-all duration-300">
                <AlertTriangle className="text-orange-400 mt-1 shrink-0" size={22} />
                <div>
                  <h4 className="text-orange-400 font-bold text-base mb-1">Over-Reliance on AI for Math</h4>
                  <p className="text-sm text-orange-200/80 leading-relaxed">{firstName} tends to ask the AI for direct answers in Calculus without attempting the steps first. <strong className="text-orange-400">Action Taken:</strong> AI will now refuse direct answers and switch to Socratic tutoring mode for Math subjects.</p>
                </div>
              </div>

              <div className="p-5 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex gap-4 items-start hover:border-blue-500/30 transition-all duration-300">
                <ShieldAlert className="text-blue-400 mt-1 shrink-0" size={22} />
                <div>
                  <h4 className="text-blue-400 font-bold text-base mb-1">Learning Risk Assessment</h4>
                  <p className="text-sm text-blue-200/90 leading-relaxed"><strong>AI Risk Explanation:</strong> {aiAnalytics.learningRisk?.why || 'Low risk observed due to high engagement with quizzes and prompt adherence.'}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default AIBehavioralProfile;
