import React from 'react';
import logo from '@/assets/logo.png';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center mb-4 group" aria-label="Digi-World Promotions Home">
              <img src={logo} alt="Digi-World Logo" className="w-12 h-12 mr-2 object-contain" />
              <div className="flex flex-col">
                <span className="font-bold text-lg uppercase tracking-tight text-white">Digi-World</span>
                <span className="text-[10px] text-brand-orange tracking-widest uppercase font-bold">Promotions</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your partner in digital political dominance. Specializing in election campaigns, social media management, and strategic branding across India.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61559011646766" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-blue hover:text-white transition-all" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="https://www.instagram.com/dw_promotions/" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-pink hover:text-white transition-all" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://wa.me/916265180430" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-brand-orange inline-block pb-1">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-brand-orange transition-colors flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> About Us</Link></li>
              <li><Link to="/services" className="hover:text-brand-orange transition-colors flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Our Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-brand-orange transition-colors flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Portfolio</Link></li>
              <li><Link to="/contact" className="hover:text-brand-orange transition-colors flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-brand-blue inline-block pb-1">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt mt-1 text-brand-pink"></i>
                <span>Bhopal, Madhya Pradesh<br/>Remote operations in All India Preferrably in <br />  (<span className='text-brand-blue' >Madhya Pradesh</span> & <span className='text-brand-orange' >Uttar Pradesh</span> )</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-phone text-brand-orange"></i>
                <a href="tel:+916265180430" className="hover:text-brand-orange transition-colors">+91 6265180430</a>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-envelope text-brand-blue"></i>
                <a href="mailto:contact@digiworldpromotions.in" className="hover:text-brand-orange transition-colors">contact@digiworldpromotions.in</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Digi-World Promotions. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Made with <span className="text-red-500">❤️</span> by <a href="https://abhay-singh-lodhi.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-white transition-colors font-medium">Abhay</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;