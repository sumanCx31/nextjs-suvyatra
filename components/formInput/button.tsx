'use client';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md";
};

const Button = ({
  children,
  variant = "primary",
  size = "sm",
  className = "",
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2";

  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    accent: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 hover:bg-slate-50",
    ghost: "hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
  };

  return (
    <button
      suppressHydrationWarning={true} // Fixed: Prevents extension-based hydration errors
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;