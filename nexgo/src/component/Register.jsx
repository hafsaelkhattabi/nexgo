import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "../lib/AuthService";
import { ArrowRight, LockKeyhole, Mail, User, Building, Users } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "customer"
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
      const response = await authService.register({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        role: formData.role
      });
      
      toast.success("Registration successful");
      
      if (response.role === "restaurant") {
        navigate("/restaurant/dashboard");
      } else if (response.role === "delivery") {
        navigate("/delivery/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4 mt-20">
      <div className="w-full max-w-md flex flex-col overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl shadow-lg border border-border/40 transition-all duration-500">
        <div className="p-8 sm:p-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-8 mx-auto">
            <Users className="w-8 h-8 text-primary text-[#502314]" />
          </div>

          <h1 className="text-3xl font-semibold text-center mb-2 text-[#502314]">Create Account</h1>
          <p className="text-center text-muted-foreground mb-8 text-[#502314]">Join our platform today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" required disabled={isLoading} />
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" required disabled={isLoading} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" required disabled={isLoading} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" required disabled={isLoading} />
            
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl text-[#502314]" disabled={isLoading}>
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="delivery">Delivery</option>
            </select>
            
            <button type="submit" disabled={isLoading} className="w-full text-[#502314] bg-primary py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#FFC72C]">
              {isLoading ? <div className="h-5 w-5 border-2 border-white/20 border-t-white animate-spin" /> : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;