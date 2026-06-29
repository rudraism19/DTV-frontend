import { BookOpen, FileWarning, GraduationCap, Clock, Loader2, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { fetchStudentData } from '../services/apiService';

export default function StudyAcademics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const syllabus = [
    { topic: 'Calculus: Derivatives', status: 'Completed', subject: 'Mathematics' },
    { topic: 'Kinematics', status: 'In Progress (60%)', subject: 'Physics' },
    { topic: 'Data Structures (Trees)', status: 'In Progress (85%)', subject: 'Computer Sci' },
    { topic: 'Comprehension & Syntax', status: 'Pending Review', subject: 'English' }
  ];

  const grades = [
    { subject: 'Mathematics', score: '88/100', grade: 'A', trend: '+2%' },
    { subject: 'Physics', score: '76/100', grade: 'B', trend: '-4%' },
    { subject: 'Computer Sci', score: '95/100', grade: 'A+', trend: '+5%' },
    { subject: 'English', score: '82/100', grade: 'B+', trend: '+1%' }
  ];

  const weakSubjects = [
    { subject: 'Physics', weakness: 'Rotational Mechanics conceptual gaps', fix: 'Assigned 3 Interactive VR simulations and simplified AI explanations for torque.' },
    { subject: 'English', weakness: 'Vocabulary retention', fix: 'Daily 10-minute AI spaced-repetition quizzes activated.' }
  ];

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  const timeData = data.timeData || [];
  const aiRecommendations = data.aiRecommendations || [];
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

      {/* Dynamic AI Study Recommendations Banner */}
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Syllabus Topics */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Active Syllabus Topics</h3>
              <BookOpen size={20} className="text-purple-400" />
            </div>
            <div className="space-y-4">
              {syllabus.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center hover:bg-white/10 transition-colors group">
                  <div>
                    <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full mb-1.5 inline-block font-bold">{item.subject}</span>
                    <h4 className="text-white font-medium block group-hover:text-purple-300 transition-colors">{item.topic}</h4>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${item.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : item.status.startsWith('In Progress') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marks / Grades */}
        <div className="glass-panel p-6 border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Marks & Grades</h3>
            <GraduationCap size={20} className="text-green-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-sm font-medium text-text-muted">Subject</th>
                  <th className="pb-3 text-sm font-medium text-text-muted">Score</th>
                  <th className="pb-3 text-sm font-medium text-text-muted">Grade</th>
                  <th className="pb-3 text-sm font-medium text-text-muted">Trend</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 text-white font-medium">{g.subject}</td>
                    <td className="py-4 text-white font-bold">{g.score}</td>
                    <td className="py-4 font-bold text-white">
                      <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-xs">
                        {g.grade}
                      </span>
                    </td>
                    <td className={`py-4 text-sm font-bold ${g.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {g.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weak Subjects & Corrections */}
        <div className="glass-panel p-6 border-red-500/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Weak Subjects & AI Fixes</h3>
            <FileWarning size={20} className="text-red-400" />
          </div>
          <div className="space-y-4">
            {weakSubjects.map((ws, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{ws.subject}</span>
                </div>
                <p className="text-sm text-white mb-4"><strong>Gap Identified:</strong> {ws.weakness}</p>
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <p className="text-sm text-green-300 leading-relaxed"><strong>AI Correction Plan:</strong> {ws.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
