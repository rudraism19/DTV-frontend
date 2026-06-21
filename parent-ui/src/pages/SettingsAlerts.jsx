import { BellRing, Smartphone, Mail, AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';

export default function SettingsAlerts() {
  const [alerts, setAlerts] = useState({
    gradeDrop: true,
    screenTime: true,
    aiFlag: true,
    weeklySummary: true,
    smsEnabled: false,
    emailEnabled: true,
  });

  const toggleAlert = (key) => {
    setAlerts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-500/20 rounded-xl">
          <BellRing className="text-slate-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Settings & Alerts</h2>
          <p className="text-text-muted">Manage how and when you receive updates about Alex.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Alert Triggers */}
        <div className="glass-panel p-6 border-white/10">
          <h3 className="text-lg font-bold text-white mb-6">Alert Triggers</h3>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} className="text-red-400" />
                <div>
                  <h4 className="text-white font-medium">Grade Drops</h4>
                  <p className="text-xs text-text-muted">Notify me if a subject grade drops below B</p>
                </div>
              </div>
              <button 
                onClick={() => toggleAlert('gradeDrop')}
                className={`w-12 h-6 rounded-full transition-colors relative ${alerts.gradeDrop ? 'bg-orange-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${alerts.gradeDrop ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-blue-400" />
                <div>
                  <h4 className="text-white font-medium">Screen Time Limit</h4>
                  <p className="text-xs text-text-muted">Notify if VR sessions exceed 2 hours/day</p>
                </div>
              </div>
              <button 
                onClick={() => toggleAlert('screenTime')}
                className={`w-12 h-6 rounded-full transition-colors relative ${alerts.screenTime ? 'bg-orange-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${alerts.screenTime ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} className="text-purple-400" />
                <div>
                  <h4 className="text-white font-medium">AI Behavioral Flag</h4>
                  <p className="text-xs text-text-muted">Notify if AI detects extreme stress or lack of focus</p>
                </div>
              </div>
              <button 
                onClick={() => toggleAlert('aiFlag')}
                className={`w-12 h-6 rounded-full transition-colors relative ${alerts.aiFlag ? 'bg-orange-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${alerts.aiFlag ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

          </div>
        </div>

        {/* Delivery Methods */}
        <div className="glass-panel p-6 border-white/10">
          <h3 className="text-lg font-bold text-white mb-6">Delivery Methods</h3>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-white" />
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-xs text-text-muted">parent@example.com</p>
                </div>
              </div>
              <button 
                onClick={() => toggleAlert('emailEnabled')}
                className={`w-12 h-6 rounded-full transition-colors relative ${alerts.emailEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${alerts.emailEnabled ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-white" />
                <div>
                  <h4 className="text-white font-medium">SMS Alerts</h4>
                  <p className="text-xs text-text-muted">+1 (555) 019-2834</p>
                </div>
              </div>
              <button 
                onClick={() => toggleAlert('smsEnabled')}
                className={`w-12 h-6 rounded-full transition-colors relative ${alerts.smsEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${alerts.smsEnabled ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95">
                Save Preferences
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
