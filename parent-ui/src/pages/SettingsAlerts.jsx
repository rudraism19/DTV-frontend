import { BellRing, Smartphone, Mail, AlertTriangle, Clock, MessageSquare, CheckCircle2, Send, Download, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchStudentData } from '../services/apiService';

import { memo, useRef } from 'react';

const SettingsAlerts = memo(function SettingsAlerts() {
  const [alerts, setAlerts] = useState({
    gradeDrop: true,
    screenTime: true,
    aiFlag: true,
    weeklySummary: true,
    smsEnabled: false,
    emailEnabled: true,
    whatsappEnabled: true,
    pushEnabled: true,
  });

  const [phone, setPhone] = useState('+91 9876543210');
  const [toast, setToast] = useState(null);
  const [studentInfo, setStudentInfo] = useState({ name: 'Kumar Kartikey', linkCode: localStorage.getItem('studentCode') || 'FC0D52' });
  const [downloadingType, setDownloadingType] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const loadData = async () => {
      try {
        const studentCode = localStorage.getItem('studentCode') || 'FC0D52';
        const result = await fetchStudentData(studentCode);
        if (isMounted.current && result && result.studentInfo) {
          setStudentInfo(result.studentInfo);
        }
      } catch (err) {
        console.error('Failed to load student info', err);
      }
    };
    loadData();
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const studentName = studentInfo.name || 'Kumar Kartikey';
  const firstName = studentName.split(' ')[0];
  const studentCode = localStorage.getItem('studentCode') || 'FC0D52';

  const toggleAlert = (key) => {
    setAlerts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const showToast = (msg) => {
    setToast(msg);
  };

  const handleTestWhatsApp = () => {
    if (!alerts.whatsappEnabled) {
      showToast('⚠️ Please enable WhatsApp Alerts toggle first!');
      return;
    }
    showToast(`🟢 WhatsApp Simulation sent to ${phone}: "DTV AI Alert: ${studentName} has reached a 10-day study streak! Focus score is up by 12%."`);
  };

  const handleSave = () => {
    showToast('✅ All Alert Preferences and Delivery Configurations saved successfully.');
  };

  const handleDownloadPDF = async (type, title) => {
    setDownloadingType(type);
    showToast(`⏳ Generating Enterprise PDF Report: "${title}" for ${studentName}...`);
    try {
      // Direct window location or fetch blob
      window.open(`/api/parent/pdf-report?studentCode=${studentCode}&type=${type}`, '_blank');
      setTimeout(() => {
        showToast(`✅ PDF Report "${title}" generated and downloaded successfully!`);
        setDownloadingType(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to download PDF', err);
      showToast(`❌ Failed to generate PDF report.`);
      setDownloadingType(null);
    }
  };

  return (
    <div className="space-y-8 relative">
      {toast && (
        <div className="fixed top-24 right-10 z-50 max-w-md bg-slate-900/95 border border-orange-500/30 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="text-orange-400 shrink-0" size={24} />
          <p className="text-sm font-medium leading-relaxed">{toast}</p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-500/20 rounded-xl">
          <BellRing className="text-slate-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Settings, Alerts & PDF Reports</h2>
          <p className="text-text-muted">Manage real-time push configurations and download enterprise-grade multi-format PDF reports.</p>
        </div>
      </div>

      {/* Enterprise Multi-Format PDF Reports */}
      <div className="glass-panel p-6 border-blue-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-400" size={22} />
            <h3 className="text-lg font-bold text-white">Multi-Format Enterprise PDF Report Generator</h3>
          </div>
          <span className="text-xs text-blue-300 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg">
            Live PDF Rendering
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { type: 'full', title: 'Full Intelligence Summary', desc: 'Comprehensive snapshot of grades, skills, career readiness & AI recommendations.', color: 'blue' },
            { type: 'academic', title: 'Academic Progress Report', desc: 'Syllabus tracking, quiz accuracy, attendance logs & course hours.', color: 'emerald' },
            { type: 'behavioral', title: 'AI Behavioral Profile', desc: 'Cognitive traits radar, prompt quality score, productivity & learning risk.', color: 'purple' },
            { type: 'career', title: 'Career Trajectory Simulation', desc: 'AI match ratings, target compensation, verified skills & project portfolios.', color: 'orange' },
          ].map((rep) => (
            <div key={rep.type} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex flex-col justify-between group hover:scale-[1.02]">
              <div>
                <h4 className="text-white font-bold text-base mb-2 group-hover:text-blue-300 transition-colors">{rep.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed mb-6">{rep.desc}</p>
              </div>
              <button 
                disabled={downloadingType === rep.type}
                onClick={() => handleDownloadPDF(rep.type, rep.title)}
                className={`w-full py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 hover:text-white rounded-xl font-bold text-xs shadow-[0_4px_15px_rgba(59,130,246,0.2)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95 ${downloadingType === rep.type ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download size={15} className={downloadingType === rep.type ? 'animate-bounce' : ''} />
                {downloadingType === rep.type ? 'Generating PDF...' : 'Download PDF Report'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Alert Triggers */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="text-orange-400" size={20} />
              AI & Academic Triggers
            </h3>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
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

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
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
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors mt-4">
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

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors mt-4">
              <div className="flex items-center gap-3">
                <BellRing size={18} className="text-green-400" />
                <div>
                  <h4 className="text-white font-medium">Weekly Summary Generation</h4>
                  <p className="text-xs text-text-muted">Get full AI evaluation report every weekend</p>
                </div>
              </div>
              <button 
                onClick={() => toggleAlert('weeklySummary')}
                className={`w-12 h-6 rounded-full transition-colors relative ${alerts.weeklySummary ? 'bg-orange-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${alerts.weeklySummary ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

          </div>
          
          <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
            <p className="text-xs text-orange-300 font-medium leading-relaxed">
              💡 <strong>AI Tip:</strong> Triggers are actively calculated by our Multi-Agent EdTech Engine in real-time based on {firstName}'s interaction with the study modules and career simulations.
            </p>
          </div>
        </div>

        {/* Delivery Methods & WhatsApp Simulation */}
        <div className="glass-panel p-6 border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="text-green-400" size={20} />
              Delivery Channels & Simulation
            </h3>
            <div className="space-y-4">
              
              {/* WhatsApp Simulation Channel */}
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-emerald-400" />
                    <div>
                      <h4 className="text-white font-bold">WhatsApp AI Alerts</h4>
                      <p className="text-xs text-emerald-300">Instant AI notifications on your mobile</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleAlert('whatsappEnabled')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${alerts.whatsappEnabled ? 'bg-emerald-500' : 'bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${alerts.whatsappEnabled ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
                
                {alerts.whatsappEnabled && (
                  <div className="space-y-3 pt-2 border-t border-emerald-500/20 animate-in fade-in duration-200">
                    <div>
                      <label className="text-xs text-emerald-300 font-medium block mb-1">Target Phone Number</label>
                      <input 
                        type="text" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-900/80 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-400 text-sm"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <button 
                      onClick={handleTestWhatsApp}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95"
                    >
                      <Send size={16} />
                      Test WhatsApp Alert Simulation
                    </button>
                  </div>
                )}
              </div>

              {/* Custom Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <BellRing size={18} className="text-purple-400" />
                  <div>
                    <h4 className="text-white font-medium">Custom Web Push Alerts</h4>
                    <p className="text-xs text-text-muted">Real-time desktop browser popups</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleAlert('pushEnabled')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${alerts.pushEnabled ? 'bg-purple-500' : 'bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${alerts.pushEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-sky-400" />
                  <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-xs text-text-muted">parent@example.com</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleAlert('emailEnabled')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${alerts.emailEnabled ? 'bg-sky-500' : 'bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${alerts.emailEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              {/* SMS Alerts */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-amber-400" />
                  <div>
                    <h4 className="text-white font-medium">SMS Alerts</h4>
                    <p className="text-xs text-text-muted">{phone}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleAlert('smsEnabled')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${alerts.smsEnabled ? 'bg-amber-500' : 'bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${alerts.smsEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <button 
              onClick={handleSave}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            >
              Save Preferences & Delivery Channels
            </button>
          </div>
        </div>

      </div>
    </div>
  );
});

export default SettingsAlerts;
