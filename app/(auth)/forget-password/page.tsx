"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  SendHorizontal,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import authService from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
// console.log("email:",email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.postRequest("auth/forget-password", {
        email,
      });
      console.log("response:",response);
      
      if (response?.data) {
        toast.success("Password reset link sent! Please check your email.");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError("We couldn't find an account with that email.");
      toast.error("We couldn't find an account with that email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        {/* Navigation Link */}
        <Link
          href="/login"
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-8 transition-colors group w-fit"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs font-black uppercase tracking-widest">
            Back to Login
          </span>
        </Link>

        {/* Glassmorphic Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-5 relative overflow-hidden"
        >
          <div className="relative z-10">
            {!submitted ? (
              <>
                <div className="mb-8 text-center md:text-left">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 mx-auto md:mx-0">
                    <SendHorizontal className="text-emerald-500" size={28} />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight uppercase italic">
                    Reset <span className="text-emerald-500">Access</span>
                  </h2>
                  <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                    Enter your email address and we'll send you a secure link to
                    reset your SuvYatra password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300 ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 pl-12 pr-5 py-4 rounded-2xl text-white text-sm focus:border-emerald-500/50 outline-none transition-all group-hover:bg-white/[0.08]"
                        placeholder="yourname@example.com"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/10"
                      >
                        <AlertCircle size={14} />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-2xl transition-all transform hover:scale-[1.01] active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <CheckCircle2 className="text-emerald-500" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 italic">
                  Check Your Inbox
                </h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  We have sent a password reset link to <br />
                  <span className="text-emerald-400 font-bold">{email}</span>
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-emerald-500 text-xs font-black uppercase tracking-widest hover:text-emerald-400 transition-colors"
                  >
                    Resend Email
                  </button>
                  <div className="h-px bg-white/10 w-1/2 mx-auto" />
                  <Link
                    href="/login"
                    className="block text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Return to Login
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
