import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { parentLogin } from '../services/apiService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !studentCode) {
      setError('Email, Password, and Student Link Code are required.');
      return;
    }

    setLoading(true);
    try {
      await parentLogin(email, password, studentCode);
      navigate('/dashboard/summary');
    } catch (err) {
      const apiError = err.response?.data;
      if (apiError?.details && apiError.details.length > 0) {
        setError(apiError.details[0].message.replace(/"/g, ''));
      } else {
        setError(apiError?.error || 'Invalid credentials or link code. Check your network.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden">
      {/* Background Orbs - Optimized without heavy CSS blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 70%)' }}></div>

      <div className="w-full max-w-md p-8 glass-panel border border-white/10 rounded-2xl relative z-10 mx-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Digital<span className="text-orange-400">Twin</span> Verse</h1>
          <p className="text-text-muted font-medium uppercase tracking-widest text-sm">Parent Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium text-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-text-muted" size={20} />
            <input
              type="email"
              placeholder="Parent Email Address"
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 text-white placeholder-text-muted transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-text-muted" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 text-white placeholder-text-muted transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-text-muted hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <a href="#" className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors hover:underline">Forgot password?</a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-orange-400 mb-3 font-bold uppercase tracking-wider flex items-center gap-1">
              <Shield size={14} /> Identity Verification
            </p>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-text-muted" size={20} />
              <input
                type="text"
                placeholder="Enter Student Link Code"
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-orange-500/30 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder-text-muted transition-all"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-text-muted mt-2 text-center">Ask your child for their unique Digital Twin Verse link code.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Access Portal'}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-xs text-text-muted font-medium tracking-wide">POWERED BY <span className="text-white font-bold">DTV</span></p>
        </div>
      </div>
    </div>
  );
}
