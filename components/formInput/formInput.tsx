"use client";
import { Controller } from "react-hook-form";
import React from 'react';
import { Search } from 'lucide-react';

export interface IEmailInputProps {
  control: any;
  name: string;
  errMsg?: string;
}

interface SearchProps {
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const EmailInput = ({
  control,
  name,
  errMsg = "",
}: Readonly<IEmailInputProps>) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        }}
        render={({ field }) => (
          <input
            {...field}
            type="email"
            autoComplete={name}
            id={name}
            placeholder="name@company.com"
            className={`w-full px-5 py-4 bg-slate-900/50 border rounded-2xl text-white
                outline-none transition-all duration-300 placeholder:text-slate-600
                ${
                  errMsg && errMsg.trim() !== ""
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/10 focus:ring-emerald-500"
                } focus:ring-2`}
          />
        )}
      />
    </>
  );
};

export const PasswordInput = ({
  control,
  name,
  errMsg = "",
}: Readonly<IEmailInputProps>) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Minimum 6 characters required",
          },
        }}
        render={({ field }) => (
          <input
            {...field}
            type="password"
            autoComplete={name}
            id={name}
            placeholder="••••••••"
            className={`w-full px-5 py-4 bg-slate-900/50 border rounded-2xl text-white
                    outline-none transition-all duration-300 placeholder:text-slate-600
                    ${
                      errMsg && errMsg.trim() !== ""
                        ? "border-red-500 focus:ring-red-500"
                        : "border-white/10 focus:ring-emerald-500"
                    } focus:ring-2`}
          />
        )}
      />
    </>
  );
};

export const TextInput = ({
  control,
  name,
  errMsg = "",
}: Readonly<IEmailInputProps>) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              {...field}
              type="text"
              className="w-full px-5 py-3 bg-slate-900/50 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-300 placeholder:text-slate-600"
              placeholder="Brad Pit"
            />
            <p className="text-red-400 text-xs mt-1 ml-1">{errMsg}</p>
          </>
        )}
      />
    </>
  );
};

export const PhoneInput = ({
  control,
  name,
  errMsg = "",
}: Readonly<IEmailInputProps>) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              {...field}
              type="tel"
              className="w-full px-5 py-3 bg-slate-900/50 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-300 placeholder:text-slate-600"
              placeholder="98xxxxxxxx"
            />
            <p className="text-red-400 text-xs mt-1 ml-1">{errMsg}</p>
          </>
        )}
      />
    </>
  );
};

export const ImageInput = ({
  control,
  name,
  errMsg = "",
}: Readonly<IEmailInputProps>) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type="file"
            onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-slate-400
                      file:mr-4 file:py-2 file:px-4 file:rounded-full
                      file:border-0 file:text-sm file:font-semibold
                      file:bg-emerald-500/10 file:text-emerald-400
                      hover:file:bg-emerald-500/20 cursor-pointer
                      bg-slate-900/50 border border-white/10 rounded-2xl py-1.75 px-2"
          />
        )}
      />
      <p className="text-red-400 text-xs mt-1 ml-1">{errMsg}</p>
    </>
  );
};

export const SearchInput: React.FC<SearchProps> = ({ 
  placeholder = "Search...", 
  onChange, 
  className = "" 
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-4 text-slate-500" size={20} />
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-emerald-500 transition-colors"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};




