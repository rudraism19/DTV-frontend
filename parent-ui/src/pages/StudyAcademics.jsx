import { BookOpen, FileWarning, GraduationCap, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudyAcademics() {
  const timeData = [
    { subject: 'Mathematics', minutes: 340, color: '#3b82f6' },
    { subject: 'Physics', minutes: 210, color: '#8b5cf6' },
    { subject: 'Computer Sci', minutes: 420, color: '#10b981' },
    { subject: 'English', minutes: 120, color: '#f59e0b' }
  ];

  const syllabus = [
    { topic: 'Calculus: Derivatives', status: 'Completed', subject: 'Mathematics' },
    { topic: 'Kinematics', status: 'In Progress (60%)', subject: 'Physics' },
    { topic: 'Data Structures (Trees)', status: 'In Progress (85%)', subject: 'Computer Sci' }
  ];

  const grades = [
    { subject: 'Mathematics', score: '88/100', grade: 'A', trend: '+2%' },
    { subject: 'Physics', score: '76/100', grade: 'B', trend: '-4%' },
    { subject: 'Computer Sci', score: '95/100', grade: 'A+', trend: '+5%' }
  ];

  const weakSubjects = [
    { subject: 'Physics', weakness: 'Rotational Mechanics conceptual gaps', fix: 'Assigned 3 Interactive VR simulations and simplified AI explanations for torque.' },
    { subject: 'English', weakness: 'Vocabulary retention', fix: 'Daily 10-minute AI spaced-repetition quizzes activated.' }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Study & Academics</h1>
        <p className="text-blue-200">Granular tracking of syllabus, time spent, and performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Time Tracker */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Subject-wise Time Tracker</h3>
            <Clock size={20} className="text-blue-400" />
          </div>
          <div className="min-h-[300px] h-[300px] sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="subject" type="category" stroke="rgba(255,255,255,0.8)" tick={{fill: 'rgba(255,255,255,0.8)'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(10,13,20,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value} mins`, 'Time Spent']}
                />
                <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                  {timeData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Syllabus Topics */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Active Syllabus Topics</h3>
            <BookOpen size={20} className="text-purple-400" />
          </div>
          <div className="space-y-4">
            {syllabus.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full mb-1 inline-block">{item.subject}</span>
                  <h4 className="text-white font-medium block">{item.topic}</h4>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold ${item.status === 'Completed' ? 'text-green-400' : 'text-blue-400'}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marks / Grades */}
        <div className="glass-panel p-6">
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
                    <td className="py-4 text-white">{g.score}</td>
                    <td className="py-4 font-bold text-white">{g.grade}</td>
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
              <div key={idx} className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{ws.subject}</span>
                </div>
                <p className="text-sm text-white mb-3"><strong>Gap Identified:</strong> {ws.weakness}</p>
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-sm text-green-300"><strong>AI Correction Plan:</strong> {ws.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
