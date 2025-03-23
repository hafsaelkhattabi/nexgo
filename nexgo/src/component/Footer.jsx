import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Footer() {
  const { darkMode } = useContext(ThemeContext); // Access darkMode from the context

  return (
    <footer
      className={`py-12 ${
        darkMode ? "bg-[#1F2937] text-white" : "bg-[#502314] text-white"
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Grid Layout for Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="mb-8 md:mb-0">
            <h3 className="font-bold text-xl mb-4">About Us</h3>
            <p className="text-sm">
              NexGo is your go-to platform for seamless food delivery and more.
              We connect you with the best restaurants and services.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="mb-8 md:mb-0">
            <h3 className="font-bold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/food" className="hover:text-[#FFC72C]">
                  NexGo Food
                </a>
              </li>
              <li>
                <a href="/order" className="hover:text-[#FFC72C]">
                  Order for Someone Else
                </a>
              </li>
              <li>
                <a href="/restaurants" className="hover:text-[#FFC72C]">
                  Restaurants
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-[#FFC72C]">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="mb-8 md:mb-0">
            <h3 className="font-bold text-xl mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <p className="text-sm">support@nexgo.com</p>
              </li>
              <li>
                <p className="text-sm">+212 702-040526</p>
              </li>
              <li>
                <p className="text-sm">123 NexGo Street, Morocco</p>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="font-bold text-xl mb-4">Subscribe</h3>
            <p className="text-sm mb-4">
              Stay updated with our latest news and offers.
            </p>
            <form className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 rounded-lg text-black"
              />
              <button
                type="submit"
                className="bg-[#FFC72C] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#e0a800] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a
              href="https://facebook.com"
              className="text-white hover:text-[#FFC72C]"
            >
              <i className="fab fa-facebook text-2xl"></i>
            </a>
            <a
              href="https://twitter.com"
              className="text-white hover:text-[#FFC72C]"
            >
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a
              href="https://instagram.com"
              className="text-white hover:text-[#FFC72C]"
            >
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a
              href="https://linkedin.com"
              className="text-white hover:text-[#FFC72C]"
            >
              <i className="fab fa-linkedin text-2xl"></i>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm">
            <p>&copy; {new Date().getFullYear()} NexGo. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;