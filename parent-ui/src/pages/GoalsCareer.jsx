import { Award, Briefcase, ChevronRight, PlayCircle, Trophy, Target } from 'lucide-react';

export default function GoalsCareer() {
  const chosenCareers = [
    { title: 'Software Architect', match: 94, status: 'Primary Path', icon: <Briefcase /> },
    { title: 'AI Research Scientist', match: 88, status: 'Alternative Path', icon: <Briefcase /> }
  ];

  const toAchieve = [
    { title: 'Master Data Structures', deadline: 'Next Week', priority: 'High', type: 'Skill' },
    { title: 'Build Full-stack E-commerce', deadline: 'End of Month', priority: 'Medium', type: 'Project' },
    { title: 'Clear Mock Interview L1', deadline: 'Tomorrow', priority: 'High', type: 'Assessment' }
  ];

  const achieved = [
    { title: 'Python Fundamentals', date: '2 days ago', type: 'Course Completed' },
    { title: '10-day Study Streak', date: 'Last week', type: 'Milestone' },
    { title: 'Top 5% in Logic Quiz', date: 'Last week', type: 'Achievement' }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Goals & Career</h1>
        <p className="text-blue-200">Simulating career trajectories and tracking active goals</p>
      </div>

      {/* Chosen Career Path */}
      <div className="glass-panel p-6 border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-4">Chosen Career Paths</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chosenCareers.map((career, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${idx === 0 ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {career.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold">{career.title}</h4>
                  <p className="text-xs text-text-muted mt-1">{career.status}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-bold text-white tracking-tighter">{career.match}%</span>
                <span className="text-xs text-text-muted">AI Match</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Things to Achieve */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Things to Achieve</h3>
            <Target size={20} className="text-orange-400" />
          </div>
          <div className="space-y-4">
            {toAchieve.map((goal, idx) => (
              <div key={idx} className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex justify-between items-center shadow-sm hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      goal.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>{goal.priority}</span>
                    <span className="text-[10px] text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full">{goal.type}</span>
                  </div>
                  <h4 className="text-white font-medium">{goal.title}</h4>
                  <p className="text-xs text-text-muted mt-1">Due: {goal.deadline}</p>
                </div>
                <PlayCircle size={20} className="text-white/30 group-hover:text-blue-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Things Achieved */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Things Achieved</h3>
            <Trophy size={20} className="text-yellow-400" />
          </div>
          <div className="space-y-4">
            {achieved.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 flex gap-4 items-center">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                  <Award size={20} />
                </div>
                <div className="flex-grow">
                  <h4 className="text-white font-medium">{item.title}</h4>
                  <p className="text-xs text-green-400 mt-1">{item.type} • {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
