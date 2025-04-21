import React, { useState, useContext } from "react";
import axios from "axios";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Upload, 
  Car, 
  Bike, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

const DeliveryApplication = () => {
  const { language, translations } = useContext(LanguageContext);
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleType: "",
    resume: null,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVehicleSelect = (value) => {
    setFormData({ ...formData, vehicleType: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("vehicleType", formData.vehicleType);
    data.append("resume", formData.resume);

    try {
      const response = await axios.post("http://localhost:5000/apply", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setSubmitStatus({ success: true, message: response.data.message });
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      
      if (error.response) {
        setSubmitStatus({ success: false, message: error.response.data.message });
      } else {
        setSubmitStatus({ success: false, message: "An error occurred while submitting your application." });
      }
      setFormSubmitted(true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      vehicleType: "",
      resume: null,
    });
    setFormSubmitted(false);
  };

  const bgColor = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-orange-50 to-amber-100";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-800";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const inputBg = darkMode ? "bg-gray-700" : "bg-white";
  const labelColor = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} py-12 px-4`}>
      <div className="max-w-2xl mx-auto rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-8">
          <h1 className="text-3xl font-bold text-center text-white drop-shadow-md">
            {translations[language]?.deliveryApplicationTitle || "Join Our Delivery Team"}
          </h1>
          <p className="text-center text-white mt-2 opacity-90">
            {translations[language]?.deliverySubtitle || "Start your journey with us today"}
          </p>
        </div>
        
        {formSubmitted ? (
          <div className={`p-8 ${cardBg}`}>
            <div className={`rounded-2xl p-8 flex flex-col items-center justify-center ${
              submitStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}>
              {submitStatus.success ? (
                <CheckCircle size={64} className="text-green-500 mb-4" />
              ) : (
                <XCircle size={64} className="text-red-500 mb-4" />
              )}
              <h2 className="text-2xl font-bold mb-2">
                {submitStatus.success ? 
                  (translations[language]?.applicationSuccess || "Application Submitted!") : 
                  (translations[language]?.applicationFailed || "Submission Failed")
                }
              </h2>
              <p className="text-center mb-6">{submitStatus.message}</p>
              <button
                onClick={resetForm}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full font-bold hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-md"
              >
                {translations[language]?.submitAnother || "Submit Another Application"}
              </button>
            </div>
          </div>
        ) : (
          <div className={`p-8 ${cardBg}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 ${labelColor} flex items-center`}>
                  <User size={16} className="mr-2" />
                  {translations[language]?.name || "Full Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={translations[language]?.namePlaceholder || "Enter your full name"}
                  className={`w-full p-3 border ${borderColor} rounded-xl ${inputBg} ${textColor} focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all`}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className={`block text-sm font-medium mb-2 ${labelColor} flex items-center`}>
                    <Mail size={16} className="mr-2" />
                    {translations[language]?.email || "Email Address"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={translations[language]?.emailPlaceholder || "Enter your email"}
                    className={`w-full p-3 border ${borderColor} rounded-xl ${inputBg} ${textColor} focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all`}
                  />
                </div>
                
                <div className="relative">
                  <label className={`block text-sm font-medium mb-2 ${labelColor} flex items-center`}>
                    <Phone size={16} className="mr-2" />
                    {translations[language]?.phoneNumber || "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder={translations[language]?.phonePlaceholder || "Enter your phone number"}
                    className={`w-full p-3 border ${borderColor} rounded-xl ${inputBg} ${textColor} focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-3 ${labelColor} flex items-center`}>
                  {translations[language]?.vehicleType || "Vehicle Type"}
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleVehicleSelect("car")}
                    className={`p-4 border ${borderColor} rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all hover:border-amber-400 ${
                      formData.vehicleType === "car" 
                        ? "border-amber-400 bg-amber-50 text-amber-800" 
                        : `${inputBg} ${textColor}`
                    }`}
                  >
                    <Car size={32} className={formData.vehicleType === "car" ? "text-amber-500" : ""} />
                    <span className="mt-2 font-medium">
                      {translations[language]?.car || "Car"}
                    </span>
                  </div>
                  
                  <div 
                    onClick={() => handleVehicleSelect("motorcycle")}
                    className={`p-4 border ${borderColor} rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all hover:border-amber-400 ${
                      formData.vehicleType === "motorcycle" 
                        ? "border-amber-400 bg-amber-50 text-amber-800" 
                        : `${inputBg} ${textColor}`
                    }`}
                  >
                    <Bike size={32} strokeWidth={1.5} className={formData.vehicleType === "motorcycle" ? "text-amber-500" : ""} />
                    <span className="mt-2 font-medium">
                      {translations[language]?.motorcycle || "Motorcycle"}
                    </span>
                  </div>
                  
                  <div 
                    onClick={() => handleVehicleSelect("bicycle")}
                    className={`p-4 border ${borderColor} rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all hover:border-amber-400 ${
                      formData.vehicleType === "bicycle" 
                        ? "border-amber-400 bg-amber-50 text-amber-800" 
                        : `${inputBg} ${textColor}`
                    }`}
                  >
                    <Bike size={32} className={formData.vehicleType === "bicycle" ? "text-amber-500" : ""} />
                    <span className="mt-2 font-medium">
                      {translations[language]?.bicycle || "Bicycle"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 ${labelColor} flex items-center`}>
                  <FileText size={16} className="mr-2" />
                  {translations[language]?.resume || "Resume/CV"}
                </label>
                <div className={`border-2 border-dashed ${borderColor} rounded-xl p-6 text-center ${inputBg}`}>
                  <input
                    type="file"
                    name="resume"
                    id="resume"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <label htmlFor="resume" className="cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                      <Upload size={24} className="text-amber-600" />
                    </div>
                    <span className="font-medium">
                      {formData.resume ? formData.resume.name : translations[language]?.uploadResume || "Upload your resume"}
                    </span>
                    <span className={`text-xs mt-2 ${labelColor}`}>
                      {translations[language]?.acceptedFormats || "Accepted formats: PDF, DOC, DOCX"}
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
                >
                  {translations[language]?.submitApplication || "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryApplication;