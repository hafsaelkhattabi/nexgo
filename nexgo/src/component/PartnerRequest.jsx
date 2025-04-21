import React, { useState } from "react";
import { User, Mail, MapPin, Image, Store, ChevronRight, CheckCircle, Upload } from "lucide-react";

const PartnerRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    restaurantName: "",
    location: "",
    menuImage: null,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      menuImage: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form Submitted:", formData);
    setFormSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      restaurantName: "",
      location: "",
      menuImage: null,
    });
    setFormSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-amber-800 mb-2">Become Our Partner</h1>
          <p className="text-amber-700 max-w-xl mx-auto">Join our growing network of restaurants and expand your business reach</p>
        </div>

        {formSubmitted ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Partnership Request Submitted!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for your interest in partnering with us. Our team will review your application and get back to you within 2-3 business days.
            </p>
            <button
              onClick={resetForm}
              className="bg-amber-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-amber-600 transition-all duration-300 shadow-md"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-6 px-8">
              <h2 className="text-2xl font-bold text-white">Partnership Application</h2>
              <p className="text-white text-opacity-90 text-sm mt-1">Fill out the form below to get started</p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="flex items-center text-gray-700 font-medium">
                      <User size={18} className="mr-2 text-amber-500" />
                      <span>Your Name</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="flex items-center text-gray-700 font-medium">
                      <Mail size={18} className="mr-2 text-amber-500" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Restaurant Name Field */}
                <div className="space-y-2">
                  <label htmlFor="restaurantName" className="flex items-center text-gray-700 font-medium">
                    <Store size={18} className="mr-2 text-amber-500" />
                    <span>Restaurant Name</span>
                  </label>
                  <input
                    type="text"
                    id="restaurantName"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="Delicious Cuisine"
                    required
                  />
                </div>

                {/* Location Field */}
                <div className="space-y-2">
                  <label htmlFor="location" className="flex items-center text-gray-700 font-medium">
                    <MapPin size={18} className="mr-2 text-amber-500" />
                    <span>Restaurant Location</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="123 Food Street, Culinary City"
                    required
                  />
                </div>

                {/* Menu Image Upload Field */}
                <div className="space-y-2">
                  <label htmlFor="menuImage" className="flex items-center text-gray-700 font-medium">
                    <Image size={18} className="mr-2 text-amber-500" />
                    <span>Upload Your Menu</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-amber-400 transition-colors">
                    <input
                      type="file"
                      id="menuImage"
                      name="menuImage"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <label htmlFor="menuImage" className="flex flex-col items-center cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                        <Upload size={24} className="text-amber-600" />
                      </div>
                      <span className="font-medium text-gray-700">
                        {formData.menuImage ? formData.menuImage.name : "Click to upload menu image"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG or PDF (Max 10MB)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-lg font-bold flex items-center justify-center hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md"
                  >
                    <span>Submit Partnership Request</span>
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                </div>
              </form>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our terms and conditions. We will contact you within 48 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <Store size={20} className="text-amber-600" />
            </div>
            <h3 className="font-bold text-lg text-amber-800 mb-2">Expand Your Reach</h3>
            <p className="text-gray-600 text-sm">Get access to our large customer base and increase your restaurant's visibility.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <User size={20} className="text-amber-600" />
            </div>
            <h3 className="font-bold text-lg text-amber-800 mb-2">Dedicated Support</h3>
            <p className="text-gray-600 text-sm">Our team will assist you with onboarding and provide ongoing technical support.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <Mail size={20} className="text-amber-600" />
            </div>
            <h3 className="font-bold text-lg text-amber-800 mb-2">Easy Integration</h3>
            <p className="text-gray-600 text-sm">Simple setup process to integrate your restaurant into our delivery platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerRequest;
