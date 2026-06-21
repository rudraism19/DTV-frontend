import { Brain, MessageSquare, Zap, Activity, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts';

export default function AIBehavioralProfile() {
  const behaviorData = [
    { subject: 'Curiosity', A: 90, fullMark: 100 },
    { subject: 'Critical Thinking', A: 85, fullMark: 100 },
    { subject: 'Resilience', A: 65, fullMark: 100 },
    { subject: 'Focus Level', A: 75, fullMark: 100 },
    { subject: 'Self-Reliance', A: 60, fullMark: 100 },
    { subject: 'Emotional Regulation', A: 80, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-500/20 rounded-xl">
          <Brain className="text-purple-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Behavioral Profile</h2>
          <p className="text-text-muted">Analysis of how Alex interacts with the Digital Twin Verse AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Chart */}
        <div className="lg:col-span-1 glass-panel border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px]"></div>
          <h3 className="text-lg font-bold text-white mb-6">Cognitive Traits</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={behaviorData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                />
                <Radar name="Alex" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Interaction Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel border border-white/10 rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <MessageSquare className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-text-muted">Questions Asked to AI</p>
                <p className="text-2xl font-bold text-white">1,248 <span className="text-sm font-normal text-green-400">+12%</span></p>
              </div>
            </div>
            
            <div className="glass-panel border border-white/10 rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Zap className="text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-text-muted">Prompt Quality Score</p>
                <p className="text-2xl font-bold text-white">A- <span className="text-sm font-normal text-text-muted">Excellent</span></p>
              </div>
            </div>
          </div>

          <div className="glass-panel border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Behavioral Alerts & Insights</h3>
            <div className="space-y-4">
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex gap-4 items-start">
                <Activity className="text-green-400 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-bold mb-1">High Curiosity Indicator</h4>
                  <p className="text-sm text-text-muted">Alex has been asking deep follow-up questions regarding Quantum Physics rather than accepting base answers. This indicates strong critical thinking.</p>
                </div>
              </div>

              <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 flex gap-4 items-start">
                <AlertTriangle className="text-orange-400 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="text-orange-400 font-bold mb-1">Over-Reliance on AI for Math</h4>
                  <p className="text-sm text-orange-200/70">Alex tends to ask the AI for direct answers in Calculus without attempting the steps first. <strong className="text-orange-300">Action Taken:</strong> AI will now refuse direct answers and switch to Socratic tutoring mode for Math subjects.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
