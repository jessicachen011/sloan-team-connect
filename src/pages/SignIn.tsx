import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { useState } from "react";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState("alexchen@mit.edu");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login();
      navigate("/add-courses");
      setLoading(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top gradient band */}
      <div className="header-gradient h-2 w-full" />

    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
        {/* Single logo — large and prominent */}
        <div className="mb-10 flex flex-col items-center gap-2">
          <img src={logoSrc} alt="SloanSync" className="h-20 w-auto" />
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">SloanSync</h1>
          <p className="text-sm text-muted-foreground tracking-wide font-medium">MIT Sloan · Team Formation Platform</p>
        </div>


        {/* Card */}
        <div className="w-full max-w-sm bg-card rounded-2xl card-shadow p-7 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in with your MIT credentials</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">MIT Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                placeholder="you@mit.edu"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all pr-12"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={handleLogin}
            className="w-full border border-border bg-secondary text-secondary-foreground font-medium py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-secondary/70 transition-all"
          >
            <span className="font-bold text-primary mr-1">MIT</span> Sign in with SSO
          </button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          SloanSync is a student-built platform for team formation at MIT Sloan.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
