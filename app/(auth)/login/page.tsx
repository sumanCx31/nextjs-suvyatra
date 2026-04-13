"use client";

import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  EmailInput,
  PasswordInput,
} from "../../../components/formInput/formInput";
import authSvc from "../../../services/auth.service";
import { toast } from "sonner";
import { useAuth } from "../../../context/auth.context";
import Button from "@/components/formInput/button";

export interface ICredentials {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { setLoggedInUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ICredentials>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<ICredentials> = async (data) => {
    try {
      // 1. Initial Login Request
      const response = await authSvc.postRequest("/auth/login", data);
      console.log("response:", response);

      if (response?.data) {
        const token = response.data.accessToken;

        // 2. Immediate Persistence
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // 3. Fetch User Profile (Passing token manually to prevent 401 race condition)
        const userRes = await authSvc.getRequest("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        

        localStorage.setItem("user", JSON.stringify(userRes.data));
        setLoggedInUserProfile(userRes.data);

        // 5. Navigate to Home
        setTimeout(() => {
          toast.success(`Welcome back, ${userRes.data.name || "User"}!`, {
            position: "top-right",
            style: { background: "#10b981", color: "white" },
          });
          router.push("/");
        }, 500);
      }
    } catch (error: any) {
      // console.error("Login sequence failed:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid email or password";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center lg:justify-end">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-5">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-400 mt-2">
            Sign in to manage your SuvYatra fleet
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email / Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
              Email or Phone
            </label>
            <EmailInput control={control} name="email" />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
              Password
            </label>
            <PasswordInput control={control} name="password" />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 accent-emerald-500 w-4 h-4 rounded-md border-white/10"
              />
              Remember me
            </label>
            <a
              href="forget-password"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50
            text-slate-900 font-bold rounded-2xl transition-all transform
            hover:scale-[1.01] active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            {isSubmitting ? "Authenticating..." : "Sign In to SuvYatra"}
          </button>

          {/* Footer Link */}
          <div>
            <p className="text-center text-slate-400 mt-6 text-sm">
              Don't have an account?{" "}
              <Link
                  href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/register`}
                  target="_blank"
                  className="font-bold text-emerald-500 hover:text-emerald-400 transition"
                >
                  Sign Up
                </Link>
            </p>
            <p className="text-center text-slate-400 mt-6 text-sm">
              Login as{" "}
              <Link
                  href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/`}
                  target="_blank"
                  className="font-bold text-emerald-500 hover:text-emerald-400 transition"
                >
                  Admin
                </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
