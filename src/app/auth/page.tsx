"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Check, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  
  // State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false, // For checkbox interaction
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Errors & real-time validation tracking
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [shake, setShake] = useState(false); // To trigger error shake

  // Reset states on mode switch
  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setErrors({});
    setIsSuccess(false);
    setFormData({ name: "", email: "", password: "", confirmPassword: "", rememberMe: false });
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (mode === "signup" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (mode === "signup" && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Force an error shake animation if validation fails
    if (Object.keys(newErrors).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500); // end shake
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear specific error softly as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        });
        if (error) throw error;
        setIsSuccess(true);
        setTimeout(() => {
          setMode("login");
          setIsSuccess(false);
          setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
        }, 2000);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (error: any) {
      setErrors({ submit: error.message || "An error occurred" });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrors({});
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setErrors({ submit: error.message || "Google login failed" });
      setIsGoogleLoading(false);
    }
  };

  // Shared generic variants
  const fadeInSlideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const formTransition = {
    hidden: { opacity: 0, x: mode === "login" ? -20 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
    exit: { opacity: 0, x: mode === "login" ? 20 : -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans p-4 relative overflow-hidden">
      
      {/* Decorative blurred background shapes (Glassmorphism/Linear vibe) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      <motion.div 
        className="w-full max-w-[420px] relative z-10"
        initial="hidden"
        animate="visible"
        variants={fadeInSlideUp}
      >
        {/* Logo Placeholder */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 22h20L12 2z"/></svg>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white/70 dark:bg-[#121212]/70 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-8 overflow-hidden">
          
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              {mode === "login" 
                ? "Enter your details to access your workspace." 
                : "Join thousands of creators building the future."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={mode} // forces remount & animation when mode changes
              onSubmit={handleSubmit}
              className="space-y-4"
              initial="hidden"
              animate={shake ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } : "visible"}
              exit="exit"
              variants={formTransition}
            >
              
              {/* Name Field (Signup Only) */}
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Name</label>
                  <div className={`relative flex items-center bg-transparent border rounded-lg transition-colors overflow-hidden group focus-within:ring-2 focus-within:ring-indigo-500/20 ${errors.name ? 'border-red-500/50 dark:border-red-500/50' : 'border-slate-200 dark:border-slate-800'}`}>
                    <div className="pl-3 text-slate-400"><User className="w-4 h-4" /></div>
                    <input 
                      type="text" name="name"
                      placeholder="Jane Doe"
                      value={formData.name} onChange={handleChange}
                      className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/>{errors.name}</p>}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email Format</label>
                <div className={`relative flex items-center bg-transparent border rounded-lg transition-colors overflow-hidden group focus-within:ring-2 focus-within:ring-indigo-500/20 ${errors.email ? 'border-red-500/50 dark:border-red-500/50' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="pl-3 text-slate-400"><Mail className="w-4 h-4" /></div>
                  <input 
                    type="text" name="email"
                    placeholder="you@example.com"
                    value={formData.email} onChange={handleChange}
                    className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/>{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Password</label>
                  {mode === "login" && (
                    <button type="button" className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors">Forgot password?</button>
                  )}
                </div>
                <div className={`relative flex items-center bg-transparent border rounded-lg transition-colors overflow-hidden group focus-within:ring-2 focus-within:ring-indigo-500/20 ${errors.password ? 'border-red-500/50 dark:border-red-500/50' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="pl-3 text-slate-400"><Lock className="w-4 h-4" /></div>
                  <input 
                    type={showPassword ? "text" : "password"} name="password"
                    placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                    className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/>{errors.password}</p>}
              </div>

              {/* Confirm Password (Signup Only) */}
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                  <div className={`relative flex items-center bg-transparent border rounded-lg transition-colors overflow-hidden group focus-within:ring-2 focus-within:ring-indigo-500/20 ${errors.confirmPassword ? 'border-red-500/50 dark:border-red-500/50' : 'border-slate-200 dark:border-slate-800'}`}>
                    <div className="pl-3 text-slate-400"><Lock className="w-4 h-4" /></div>
                    <input 
                      type={showPassword ? "text" : "password"} name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword} onChange={handleChange}
                      className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/>{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Micro-interaction: Checkbox Remember Me / Terms */}
              <div className="flex items-center pt-1 pb-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-[#1a1a1a] group-hover:border-indigo-500 transition-colors">
                    <input 
                      type="checkbox" name="rememberMe" 
                      className="opacity-0 absolute inset-0 cursor-pointer"
                      checked={formData.rememberMe} onChange={handleChange}
                    />
                    <AnimatePresence>
                      {formData.rememberMe && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute">
                          <Check className="w-3 h-3 text-indigo-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 select-none">
                    {mode === "login" ? "Remember me for 30 days" : "I agree to the Terms of Service"}
                  </span>
                </label>
              </div>

              {/* Primary CTA Button */}
              <motion.button
                whileHover={{ scale: 1.01, boxShadow: "0px 4px 15px rgba(99, 102, 241, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || isSuccess}
                className="w-full relative flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden shadow-sm"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div key="loader" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                  ) : isSuccess ? (
                    <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> {mode === "login" ? "Signed in" : "Account Created"}
                    </motion.div>
                  ) : (
                    <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      {mode === "login" ? "Sign in" : "Create Account"}
                      <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>
          </AnimatePresence>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-medium text-slate-400">
                <span className="bg-white dark:bg-[#121212] px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <motion.button 
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading || isSuccess}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full flex items-center justify-center gap-3 py-2.5 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#222] rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </>
              )}
            </motion.button>
          </div>

        </div>

        {/* Footer Toggle */}
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button 
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline hover:text-indigo-700 transition-colors"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>

      </motion.div>
    </div>
  );
}
