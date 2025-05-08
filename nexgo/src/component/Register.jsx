import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "../services/AuthService";
import { ArrowRight, LockKeyhole, Mail, User, Users } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the specific customer registration method
      const response = await authService.registerCustomer({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      
      toast.success("Registration successful");
      
      // If the registration also logged the user in, navigate to customer dashboard
      if (response && response.token) {
        navigate("/customer");
      } else {
        // Otherwise, redirect to login page
        navigate("/auth");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4">
      <div className="w-full max-w-md flex flex-col overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl shadow-lg border border-border/40 transition-all duration-500">
        <div className="p-8 sm:p-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-8 mx-auto">
            <Users className="w-8 h-8 text-primary text-[#502314]" />
          </div>

          <h1 className="text-3xl font-semibold text-center mb-2 text-[#502314]">Create Account</h1>
          <p className="text-center text-muted-foreground mb-8 text-[#502314]">Join our platform today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#502314]" />
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 pl-10 border rounded-xl" required disabled={isLoading} />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#502314]" />
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full px-4 py-3 pl-10 border rounded-xl" required disabled={isLoading} />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#502314]" />
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 pl-10 border rounded-xl" required disabled={isLoading} />
            </div>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#502314]" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 pl-10 border rounded-xl" required disabled={isLoading} />
            </div>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#502314]" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 pl-10 border rounded-xl" required disabled={isLoading} />
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full text-[#502314] bg-primary py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#FFC72C]">
              {isLoading ? <div className="h-5 w-5 border-2 border-white/20 border-t-white animate-spin" /> : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;