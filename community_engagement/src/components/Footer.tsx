import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-white">CivicPulse</h2>
            <p className="text-sm mt-1">Empowering Austin through civic engagement</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition duration-200">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition duration-200">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition duration-200">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 flex flex-col md:flex-row justify-between text-sm">
          <p>© 2023 CivicPulse. All rights reserved.</p>
          <div className="mt-2 md:mt-0 space-x-4">
            <a href="#" className="hover:text-white transition duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition duration-200">Terms of Service</a>
            <a href="#" className="hover:text-white transition duration-200">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;