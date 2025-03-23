import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "../lib/AuthService";
import { ArrowRight, LockKeyhole, User } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const role = authService.getUserRole();
      redirectBasedOnRole(role);
    }
  }, []);

  const redirectBasedOnRole = (role) => {
    if (role === "restaurant") navigate("/restaurant/dashboard");
    else if (role === "delivery") navigate("/delivery/dashboard");
    else if (role === "customer") navigate("/customer/dashboard");
    else if (role === "admin") navigate("/admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authService.login({ username, password });
      toast.success("Login successful");
      redirectBasedOnRole(response.role);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4 mt-20">
      <div className="w-full max-w-md flex flex-col rounded-3xl bg-white/80 backdrop-blur-xl shadow-lg border border-border/40 p-8 sm:p-10">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-8 mx-auto">
          <LockKeyhole className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl font-semibold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-muted-foreground mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="w-5 h-5 text-muted-foreground/60" />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-10 py-3 bg-white/50 border border-border/60 rounded-xl focus:border-primary/40 focus:ring-primary/30"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockKeyhole className="w-5 h-5 text-muted-foreground/60" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-3 bg-white/50 border border-border/60 rounded-xl focus:border-primary/40 focus:ring-primary/30"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end">
            <a href="#" className="text-primary/90 text-sm hover:text-primary transition-colors">Forgot password?</a>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">Don't have an account? <a href="/register" className="text-primary font-medium hover:underline">Create account</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;