"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ShieldAlert
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import authService from "@/services/auth.service";

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [bearerToken, setBearerToken] = useState(""); // Stores the temporary token from verify API
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState({ new: false, confirm: false });
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  // 1. Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setIsVerifying(false);
        return;
      }
      try {
        // Calls your endpoint: auth/forget-password-verify/{token}
        const response = await authService.getRequest(`auth/forget-password-verify/${token}`);
        
        if (response?.data) {
          setBearerToken(response.data); // Save the session/bearer token
          setIsTokenValid(true);
        }
      } catch (err) {
        console.error("Token verification failed", err);
        setIsTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };
    verifyToken();
  }, [token]);

  // 2. Handle actual password reset submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      
      const resetRes = await authService.putRequest(`auth/reset-password`, {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }, {
        headers: {
          "Authorization": `Bearer ${bearerToken}`
        }
      });

      if (resetRes?.status) {
        toast.success("Password reset successful!", {
          style: { background: "#10b981", color: "white" },
        });
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI STATES ---

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
        <p className="text-slate-400 font-medium animate-pulse">Verifying secure link...</p>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem]"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-red-500/20">
          <ShieldAlert className="text-red-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 uppercase italic">Invalid Link</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          This reset link has expired or is invalid. Please request a new one.
        </p>
        <button 
          onClick={() => router.push("/forgot-password")}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-5 relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="mb-8">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
            <Lock className="text-emerald-500" size={28} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight uppercase italic">
            New <span className="text-emerald-500">Password</span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Set a strong password to regain access to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PasswordField 
            label="New Password"
            value={formData.password}
            show={showPass.new}
            onToggle={() => setShowPass({...showPass, new: !showPass.new})}
            onChange={(v: string) => setFormData({...formData, password: v})}
          />

          <PasswordField 
            label="Confirm New Password"
            value={formData.confirmPassword}
            show={showPass.confirm}
            onToggle={() => setShowPass({...showPass, confirm: !showPass.confirm})}
            onChange={(v: string) => setFormData({...formData, confirmPassword: v})}
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-2xl transition-all transform hover:scale-[1.01] active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}

const PasswordField = ({ label, value, show, onToggle, onChange }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-300 ml-1">{label}</label>
    <div className="relative group">
      <input 
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-white text-sm focus:border-emerald-500/50 outline-none transition-all pr-12 group-hover:bg-white/[0.08]"
        placeholder="••••••••"
      />
      <button 
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);