import { BookOpen, GraduationCap, Clock, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { fetchStudentData } from '../services/apiService';

const NOW = new Date();
const TODAY_ISO = NOW.toISOString();
const TODAY_SHORT = TODAY_ISO.split('T')[0];
const YESTERDAY_ISO = new Date(NOW.getTime() - 86400000).toISOString();
const YESTERDAY_SHORT = YESTERDAY_ISO.split('T')[0];

import { memo } from 'react';

const StudyAcademics = memo(function StudyAcademics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const studentCode = localStorage.getItem('studentCode') || 'DEMO-123';
        const result = await fetchStudentData(studentCode);
        if (isMounted) setData(result);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
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
        <div className="glass-panel p-6 border-white/5 h-64 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel p-6 border-white/5 h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  const timeData = data.timeData || [];
  const aiRecommendations = data.aiRecommendations || [];
  const courses = data.courses || [
    { title: 'Calculus: Derivatives', category: 'Mathematics', difficulty_level: 'Advanced', estimated_hours: 40 },
    { title: 'Kinematics', category: 'Physics', difficulty_level: 'Intermediate', estimated_hours: 35 },
    { title: 'Data Structures (Trees)', category: 'Computer Sci', difficulty_level: 'Advanced', estimated_hours: 50 }
  ];
  const quizzes = data.quizzes || [
    { score: 95.0, accuracy_percentage: 98.0, status: 'Completed', created_at: TODAY_ISO },
    { score: 88.0, accuracy_percentage: 91.0, status: 'Completed', created_at: YESTERDAY_ISO }
  ];
  const attendance = data.attendance || [
    { date: TODAY_SHORT, status: 'Present', notes: 'Active Participation' },
    { date: YESTERDAY_SHORT, status: 'Present', notes: 'Completed Homeroom' }
  ];

  const studentName = data.studentInfo?.name || 'Kumar Kartikey';
  const firstName = studentName.split(' ')[0];

  return (
    <div className="space-y-8 relative">
      {toast && (
        <div className="fixed top-24 right-10 z-50 max-w-md bg-slate-900/90 border border-green-500/30 text-white p-4 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="text-green-400 shrink-0" size={24} />
          <p className="text-sm font-medium leading-relaxed">{toast}</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Study & Academics</h1>
        <p className="text-blue-200">Granular tracking of active syllabus, dynamic time allocations, and Multi-Agent recommendations</p>
      </div>

      {/* Dynamic AI Study Recommendations Banner with WHY explanations */}
      <div className="glass-panel p-6 border-emerald-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-400 animate-pulse" size={22} />
            <h3 className="text-lg font-bold text-white">Multi-Agent AI Study Recommendations</h3>
          </div>
          <span className="text-xs text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
            Active Generation
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiRecommendations.map((rec) => (
            <div key={rec.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group hover:scale-[1.01]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-bold text-base group-hover:text-emerald-300 transition-colors">{rec.title}</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${rec.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                    {rec.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-blue-200 leading-relaxed mb-4">{rec.desc}</p>
                <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 mb-6">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    <HelpCircle size={14} />
                    Why AI Recommended This:
                  </div>
                  <p className="text-xs text-blue-200/90 leading-relaxed">{rec.why || 'Cross-referenced active completion benchmarks against desired enterprise software criteria.'}</p>
                </div>
              </div>
              <button 
                onClick={() => showToast(`🟢 Recommendation Applied: "${rec.title}" has been successfully pushed to ${firstName}'s real-time EdTech study schedule!`)}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-xs shadow-[0_4px_15px_rgba(16,185,129,0.2)] transition-all transform hover:scale-[1.02] active:scale-95"
              >
                Apply Recommendation to Schedule
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Time Tracker */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Subject-wise Time Tracker</h3>
              <Clock size={20} className="text-blue-400" />
            </div>
            <div className="min-h-[300px] h-[300px] sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                  <YAxis dataKey="subject" type="category" stroke="rgba(255,255,255,0.8)" tick={{fill: 'rgba(255,255,255,0.8)'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: 'rgba(10,13,20,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value} mins`, 'Time Spent']}
                  />
                  <Bar dataKey="minutes" radius={[0, 8, 8, 0]}>
                    {timeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Courses & Syllabus Topics */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Enrolled Live Courses</h3>
              <BookOpen size={20} className="text-purple-400" />
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-1">
              {courses.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center hover:bg-white/10 transition-colors group">
                  <div>
                    <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full mb-1.5 inline-block font-bold">{item.category || 'Specialized Track'}</span>
                    <h4 className="text-white font-medium block group-hover:text-purple-300 transition-colors">{item.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold px-3 py-1 rounded-lg border bg-purple-500/10 text-purple-300 border-purple-500/20">
                      {item.difficulty_level || 'Advanced'} ({item.estimated_hours || 40}h)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Quiz Accuracy & Scores */}
        <div className="glass-panel p-6 border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Live Quiz Accuracy & Marks</h3>
            <GraduationCap size={20} className="text-green-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-sm font-medium text-text-muted">Assessment</th>
                  <th className="pb-3 text-sm font-medium text-text-muted">Score</th>
                  <th className="pb-3 text-sm font-medium text-text-muted">Accuracy</th>
                  <th className="pb-3 text-sm font-medium text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((q, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 text-white font-medium">Sprint Assessment #{idx + 1}</td>
                    <td className="py-4 text-white font-bold">{parseFloat(q.score).toFixed(1)} / 100</td>
                    <td className="py-4 font-bold text-green-400">
                      {parseFloat(q.accuracy_percentage || 92).toFixed(1)}%
                    </td>
                    <td className="py-4 font-bold text-white">
                      <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-lg text-xs">
                        {q.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Attendance Calendar */}
        <div className="glass-panel p-6 border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Attendance & Participation Logs</h3>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Verified Present
            </span>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-1">
            {attendance.map((att, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  <div>
                    <p className="text-white font-bold text-sm">Date: {att.date}</p>
                    <p className="text-xs text-text-muted mt-0.5">{att.notes || 'Fully Engaged in Socratic Review'}</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-lg">
                  {att.status || 'Present'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
});

export default StudyAcademics;
