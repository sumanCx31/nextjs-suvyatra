"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" });

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, msg: "" });

    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: 'error', msg: "New passwords do not match!" });
    }

    if (formData.newPassword.length < 6) {
      return setStatus({ type: 'error', msg: "Password must be at least 6 characters." });
    }

    try {
      setLoading(true);
      const res: any = await authService.putRequest("auth/change-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      // Fixed: Checking res.data.status or res.status based on typical authSvc patterns
      if (res?.data?.status === "PASSWORD_CHANGE_SUCCESS" || res?.status === "PASSWORD_CHANGE_SUCCESS") {
        setStatus({ type: 'success', msg: "Password updated successfully!" });
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Change Password Error:", err);
      setStatus({ 
        type: 'error', 
        msg: err?.response?.data?.message || "Invalid current password or update failed." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-28 pb-20 px-4">
      <div className="max-w-md mx-auto">
        
        {/* Back Button */}
        <Link 
          href="/profile" 
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-8 transition-all group w-fit"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Profile</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Background Blur */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-emerald-500/20 bg-emerald-500/5">
                <Lock className="text-emerald-500" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">
                  Security <span className="text-emerald-500">Update</span>
                </h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Change Account Password</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <PasswordField 
                label="Current Password"
                value={formData.oldPassword}
                onChange={(v) => setFormData({...formData, oldPassword: v})}
                show={showPass.current}
                onToggle={() => setShowPass({...showPass, current: !showPass.current})}
              />

              <div className="h-px bg-white/5 mx-2" />

              <div className="space-y-4">
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
              </div>

              {/* Status Message */}
              <AnimatePresence mode="wait">
                {status.type && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl text-[11px] font-bold tracking-tight shadow-sm ${
                      status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
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
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating Manifest...
                  </>
                ) : (
                  "Update Password"
                )}
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
        className="w-full bg-slate-950/40 border border-white/5 px-5 py-4 rounded-2xl text-white text-sm font-bold focus:border-emerald-500/50 outline-none transition-all pr-12 group-hover:bg-slate-950/60"
        placeholder="••••••••"
      />
      <button 
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors p-1"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);