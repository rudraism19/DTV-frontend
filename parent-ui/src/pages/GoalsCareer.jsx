import { Award, Briefcase, ChevronRight, PlayCircle, Trophy, Target, Sparkles, CheckCircle2, TrendingUp, Cpu, Star, HelpCircle, Code } from 'lucide-react';
import { useState, useEffect, useRef, memo } from 'react';
import { fetchStudentData } from '../services/apiService';

const GoalsCareer = memo(function GoalsCareer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [activeTab, setActiveTab] = useState('simulation');
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
        <div className="glass-panel p-8 border-white/5 h-80 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel p-6 border-white/5 h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  const toAchieve = data.toAchieve || [
    { title: 'Master Data Structures', deadline: 'Next Week', priority: 'High', type: 'Skill', impact: '+15% Algorithm Match' },
    { title: 'Build Full-stack E-commerce', deadline: 'End of Month', priority: 'Medium', type: 'Project', impact: '+25% System Design' },
    { title: 'Clear Mock Interview L1', deadline: 'Tomorrow', priority: 'High', type: 'Assessment', impact: '+10% Communication' },
    { title: 'Optimizing Virtual DOM state', deadline: 'In 3 Days', priority: 'High', type: 'Frameworks', impact: '+18% Frontend Arch' }
  ];

  const achieved = data.achieved || [
    { title: 'Python Fundamentals', date: '2 days ago', type: 'Course Completed', score: '98% Accuracy' },
    { title: '10-day Study Streak', date: 'Last week', type: 'Milestone', score: 'Flawless Execution' },
    { title: 'Top 5% in Logic Quiz', date: 'Last week', type: 'Achievement', score: 'Percentile 95' },
    { title: 'React Performance Foundations', date: '2 weeks ago', type: 'Certification', score: 'Elite Badge Passed' }
  ];

  const skills = data.skills || [
    { skill_name: 'Abstract Logic', proficiency_level: 'Advanced', score: 94.5, improvement_percentage: 12.5 },
    { skill_name: 'Systems Architecture', proficiency_level: 'Advanced', score: 91.0, improvement_percentage: 15.0 }
  ];

  const projects = data.projects || [
    { title: 'High-Scale AI Agent Network', description: 'Multi-agent simulation environment.', status: 'Completed', problem_solving_score: 96.5 },
    { title: 'Orbital Habitat Simulation', description: 'Zero-gravity physics calculation engine.', status: 'In_Progress', problem_solving_score: 92.0 }
  ];

  const chosenCareers = data.careerInsights || [
    { title: 'Software Architect', match: 94, status: 'Primary Path', growth: '+28% Demand', salary: '$160k - $220k', focus: 'System Design & High-scale Cloud' },
    { title: 'AI Research Scientist', match: 88, status: 'Alternative Path', growth: '+45% Demand', salary: '$180k - $250k', focus: 'Deep Learning & Advanced Calculus' }
  ];

  const aiAnalytics = data.aiAnalytics || {};
  const studentName = data.studentInfo?.name || 'Kumar Kartikey';
  const firstName = studentName.split(' ')[0];

  return (
    <div className="space-y-8 relative">
      {toast && (
        <div className="fixed top-24 right-10 z-50 max-w-md bg-slate-900/90 border border-purple-500/30 text-white p-4 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="text-purple-400 shrink-0" size={24} />
          <p className="text-sm font-medium leading-relaxed">{toast}</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Goals & Career Trajectories</h1>
        <p className="text-blue-200">Simulating long-term career outcomes, tracking active milestones, and AI-driven growth forecasting</p>
      </div>

      {/* AI Career Readiness Assessment Banner */}
      <div className="glass-panel p-8 border-purple-500/30 relative overflow-hidden shadow-[0_10px_30px_rgba(168,85,247,0.1)]">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)' }}></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <Cpu className="text-purple-400 animate-pulse" size={22} />
            <h3 className="text-lg font-bold text-white">AI Career Readiness Assessment</h3>
          </div>
          <span className="text-xs text-purple-300 font-bold bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg">
            Readiness: {aiAnalytics.careerReadiness?.value || '92%'}
          </span>
        </div>
        <div className="p-4 bg-black/40 rounded-xl border border-white/5 mb-8 relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
            <HelpCircle size={15} />
            Why AI Calculated This Career Match:
          </div>
          <p className="text-xs text-blue-200 leading-relaxed">{aiAnalytics.careerReadiness?.why || 'Calculated by evaluating student problem-solving persistence and active logical assessment execution.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {chosenCareers.map((career, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedCareer(career)}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-[0_8px_25px_rgba(168,85,247,0.15)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3.5 rounded-2xl border ${idx === 0 ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 group-hover:bg-purple-500 group-hover:text-white' : 'bg-blue-500/20 text-blue-400 border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white'} transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)]`}>
                      <Briefcase size={22} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors">{career.title}</h4>
                      <p className="text-xs text-purple-300 font-medium mt-0.5">{career.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-3xl font-bold text-white tracking-tighter">{career.match}%</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted">AI Match</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 my-4 pt-4 border-t border-white/5 text-xs">
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider mb-1">Growth Forecast</span>
                    <span className="text-green-400 font-bold flex items-center gap-1"><TrendingUp size={14} /> {career.growth || '+32% Demand'}</span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider mb-1">Target Compensation</span>
                    <span className="text-white font-bold">{career.salary || '$160k - $210k'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-purple-400 pt-2 group-hover:text-purple-300 transition-colors">
                <span>View Real-time Interactive Simulation</span>
                <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Live Verified Skills */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Live Verified Skills</h3>
              <Star size={20} className="text-yellow-400" />
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {skills.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center hover:bg-white/10 transition-all">
                  <div>
                    <span className="text-[10px] font-bold text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full mb-1.5 inline-block">{s.proficiency_level || 'Advanced'}</span>
                    <h4 className="text-white font-bold block">{s.skill_name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-green-400 block">{parseFloat(s.score || 92).toFixed(1)}% Mastery</span>
                    <span className="text-[10px] text-text-muted block mt-0.5">+{s.improvement_percentage || 10}% growth</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Projects & Portfolio */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Live Projects & Enterprise Portfolio</h3>
              <Code size={20} className="text-blue-400" />
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {projects.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold">{p.title}</h4>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${p.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                      {p.status || 'Completed'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 mb-3">{p.description}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-text-muted font-bold">
                    <span>Problem Solving Rating</span>
                    <span className="text-purple-400">{parseFloat(p.problem_solving_score || 95).toFixed(1)} / 100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Things to Achieve */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Active Goals to Achieve</h3>
              <Target size={20} className="text-orange-400" />
            </div>
            <div className="space-y-4">
              {toAchieve.map((goal, idx) => (
                <div 
                  key={idx} 
                  onClick={() => showToast(`🟢 Action Triggered: Live AI tutor has prioritized "${goal.title}" for ${firstName}'s next 24-hour study cycle.`)}
                  className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex justify-between items-center shadow-sm hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)]"
                >
                  <div>
                    <div className="flex gap-2 items-center mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        goal.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>{goal.priority} Priority</span>
                      <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">{goal.type}</span>
                    </div>
                    <h4 className="text-white font-bold text-base group-hover:text-orange-300 transition-colors">{goal.title}</h4>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="text-text-muted">Due: {goal.deadline}</span>
                      <span className="text-green-400 font-bold">{goal.impact}</span>
                    </div>
                  </div>
                  <PlayCircle size={24} className="text-white/30 group-hover:text-orange-400 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Things Achieved */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Milestones Achieved</h3>
              <Trophy size={20} className="text-yellow-400" />
            </div>
            <div className="space-y-4">
              {achieved.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 flex gap-4 items-center hover:border-green-500/40 transition-all duration-300 group hover:scale-[1.01]">
                  <div className="p-3 bg-green-500/20 rounded-2xl text-green-400 border border-green-500/30 group-hover:bg-green-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    <Award size={24} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-bold text-base group-hover:text-green-300 transition-colors">{item.title}</h4>
                      <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                        {item.score}
                      </span>
                    </div>
                    <p className="text-xs text-green-300/80 font-medium">{item.type} • {item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Career Simulation Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedCareer(null)}></div>
          <div className="glass-panel border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex-shrink-0 rounded-t-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)' }}></div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                      <Briefcase size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{selectedCareer.title}</h2>
                      <p className="text-purple-300 text-sm font-medium mt-0.5">{selectedCareer.status} • Digital Twin Universe AI Agent Simulation</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-center min-w-[110px]">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">AI Match Score</p>
                    <p className="text-green-400 font-bold text-2xl tracking-tight">{selectedCareer.match}%</p>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-center min-w-[110px]">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">Projected Salary</p>
                    <p className="text-white font-bold text-xl tracking-tight">{selectedCareer.salary}</p>
                  </div>
                </div>
              </div>

              {/* Simulation Navigation Tabs */}
              <div className="flex gap-3 mt-8 relative z-10 border-b border-white/10 pb-2">
                <button 
                  onClick={() => setActiveTab('simulation')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'simulation' ? 'bg-purple-500 text-white shadow-[0_4px_15px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                >
                  Live Multi-Agent Simulation
                </button>
                <button 
                  onClick={() => setActiveTab('prerequisites')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'prerequisites' ? 'bg-purple-500 text-white shadow-[0_4px_15px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                >
                  Actionable Prerequisites
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar space-y-6">
              {activeTab === 'simulation' ? (
                <>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-bold text-lg flex items-center gap-2">
                        <Sparkles className="text-purple-400 animate-pulse" size={20} />
                        Digital Twin Trajectory Projection
                      </h4>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                        ● Live Calculation
                      </span>
                    </div>
                    <p className="text-sm text-blue-200 leading-relaxed">
                      Based on {firstName}'s current performance across Mathematics (88/100) and Computer Science (95/100), the Digital Twin simulation engine projects a 94% alignment with elite enterprise software organizations within 36 months.
                    </p>
                    <div className="p-4 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between">
                      <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Key Optimization Focus</span>
                      <span className="text-xs text-purple-300 font-bold">{selectedCareer.focus || 'System Design & High-scale Cloud'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl">
                      <h5 className="text-purple-400 font-bold text-sm mb-2">Primary Industry Advantages</h5>
                      <ul className="space-y-2 text-xs text-gray-300 font-medium">
                        <li className="flex items-center gap-2">🟢 Excellent logic quiz completion track record</li>
                        <li className="flex items-center gap-2">🟢 High percentile ranking in Data Structures</li>
                        <li className="flex items-center gap-2">🟢 Superior focus persistence during deep study sessions</li>
                      </ul>
                    </div>
                    <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                      <h5 className="text-blue-400 font-bold text-sm mb-2">Recommended Enrichment</h5>
                      <ul className="space-y-2 text-xs text-gray-300 font-medium">
                        <li className="flex items-center gap-2">🔵 Complete advanced distributed systems simulation</li>
                        <li className="flex items-center gap-2">🔵 Engage with AI peer code reviews bi-weekly</li>
                        <li className="flex items-center gap-2">🔵 Advance mathematics calculus derivatives to 100% mastery</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-white font-bold text-lg mb-4">Required Academic Roadmap Prerequisites</h4>
                  {[
                    { name: 'Data Structures & Algorithms Advanced', status: 'In Progress', progress: 85, time: '3 weeks left' },
                    { name: 'System Design Virtual Lab Simulation', status: 'Scheduled', progress: 0, time: 'Next Month' },
                    { name: 'High-Performance Cloud Architecture', status: 'Locked', progress: 0, time: 'Next Quarter' }
                  ].map((req, idx) => (
                    <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div className="flex-1 mr-6">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-white font-bold text-sm">{req.name}</h5>
                          <span className={`text-xs font-bold ${req.progress > 0 ? 'text-purple-400' : 'text-text-muted'}`}>{req.status}</span>
                        </div>
                        <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" style={{ width: `${req.progress}%` }}></div>
                        </div>
                      </div>
                      <span className="text-xs text-text-muted font-medium bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
                        {req.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20 rounded-b-3xl flex justify-end gap-4 flex-shrink-0">
              <button 
                onClick={() => {
                  showToast(`🟢 Optimization Active: AI Engine is now tailoring ${firstName}'s routine for the "${selectedCareer.title}" career track.`);
                  setSelectedCareer(null);
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-bold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(168,85,247,0.3)]"
              >
                Apply AI Routine Optimization
              </button>
              <button 
                onClick={() => setSelectedCareer(null)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all active:scale-95 border border-white/10"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
});

export default GoalsCareer;
