"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: 'error', msg: "New passwords do not match!" });
    }

    try {
      setLoading(true);
      setStatus({ type: 'success', msg: "Password updated successfully!" });
      setTimeout(() => router.push("/profile"), 2000);
    } catch (err: any) {
      setStatus({ type: 'error', msg: "Failed to update password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-4">
      <div className="max-w-md mx-auto">
        
        {/* Back Button */}
        <Link 
          href="/profile" 
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-8 transition-colors group w-fit"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Profile</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-slate-900 blur-[80px] rounded-full" />

          <div className="relative z-10">
            <div className="w-14 h-14  rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Lock className="text-emerald-500" size={28} />
            </div>
            <p className="text-slate-400 text-sm mb-8 font-medium">
              Update your account password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <PasswordField 
                label="Current Password"
                value={formData.currentPassword}
                onChange={(v) => setFormData({...formData, currentPassword: v})}
                show={showPass.current}
                onToggle={() => setShowPass({...showPass, current: !showPass.current})}
              />

              <div className="h-px bg-white/5 my-2" />

              <PasswordField 
                label="New Password"
                value={formData.newPassword}
                onChange={(v) => setFormData({...formData, newPassword: v})}
                show={showPass.new}
                onToggle={() => setShowPass({...showPass, new: !showPass.new})}
              />

              <PasswordField 
                label="Confirm New Password"
                value={formData.confirmPassword}
                onChange={(v) => setFormData({...formData, confirmPassword: v})}
                show={showPass.confirm}
                onToggle={() => setShowPass({...showPass, confirm: !showPass.confirm})}
              />

              {/* Status Message */}
              <AnimatePresence mode="wait">
                {status.type && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-bold ${
                      status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {status.msg}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-tighter italic rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT ---

interface PassProps {
  label: string;
  value: string;
  show: boolean;
  onChange: (val: string) => void;
  onToggle: () => void;
}

const PasswordField = ({ label, value, show, onChange, onToggle }: PassProps) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className="relative group">
      <input 
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full bg-white/5 border border-white/5 px-5 py-4 rounded-2xl text-white text-sm font-bold focus:border-emerald-500 outline-none transition-all pr-12 group-hover:bg-white/[0.08]"
        placeholder="••••••••"
      />
      <button 
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);