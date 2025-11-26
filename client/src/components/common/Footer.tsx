import React from 'react';
import { MapPin, Mail, Phone, ExternalLink, Twitter, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container-custom mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white text-primary-600 p-1.5 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-landmark">
                  <line x1="3" x2="21" y1="22" y2="22"></line>
                  <line x1="6" x2="6" y1="18" y2="11"></line>
                  <line x1="10" x2="10" y1="18" y2="11"></line>
                  <line x1="14" x2="14" y1="18" y2="11"></line>
                  <line x1="18" x2="18" y1="18" y2="11"></line>
                  <polygon points="12 2 20 7 4 7"></polygon>
                </svg>
              </div>
              <span className="text-xl font-semibold text-white">Hamara Shehar</span>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering citizens to collaborate with authorities for a better, more responsive urban experience.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" className="text-white hover:text-primary-400 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" className="text-white hover:text-primary-400 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/swasti.chaudharyy/" className="text-white hover:text-primary-400 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-300 hover:text-white transition-colors">Report an Issue</Link>
              </li>
              <li>
                <Link to="/issues" className="text-gray-300 hover:text-white transition-colors">Browse Issues</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="flex-shrink-0 mt-0.5 text-primary-400" />
                <span className="text-gray-300">123 Urban Plaza, <br/>Civic Center, Delhi, 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="flex-shrink-0 text-primary-400" />
                <a href="mailto:swastichaudhary9@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  swastichaudhary9@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="flex-shrink-0 text-primary-400" />
                <a href="tel:+919667872905" className="text-gray-300 hover:text-white transition-colors">
                  +91 9667872905
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>FAQ</span>
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Terms of Service</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Community Guidelines</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Volunteer</span>
                  <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Hamara Shehar. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0">
              <ul className="flex items-center space-x-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;