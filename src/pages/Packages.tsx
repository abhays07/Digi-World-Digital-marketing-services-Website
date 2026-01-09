import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PackageItem, PackageType } from '../types';
import SEO from '../components/SEO';

interface PackagesProps {
  withSEO?: boolean;
}

const Packages: React.FC<PackagesProps> = ({ withSEO = true }) => {
  const packages: PackageItem[] = [
    {
      id: 1,
      name: PackageType.Silver,
      price: "Starter",
      features: [
        "Basic Social Media (FB & Insta)",
        "15 Graphics Post / Month",
        "Basic Content Writing",
        "Weekly Performance Report",
        "Email Support"
      ]
    },
    {
      id: 2,
      name: PackageType.Gold,
      price: "Popular",
      recommended: true,
      features: [
        "Everything in Silver",
        "Daily Social Media Posting",
        "4 Reels / Short Videos",
        "Basic Ad Setup (Budget Extra)",
        "Strategy Consultation",
        "Priority WhatsApp Support"
      ]
    },
    {
      id: 3,
      name: PackageType.Diamond,
      price: "Premium",
      features: [
        "Everything in Gold",
        "Complete Campaign Management",
        "Aggressive Ad Optimization",
        "High-End Video Production",
        "Dedicated Account Manager",
        "Crisis Management Support",
        "24/7 War Room Access"
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="py-16 min-h-screen"
    >
      {withSEO && (
        <SEO 
          title="Packages | Digi-World Promotions"
          description="Choose the right digital marketing package for your political campaign. Silver, Gold, and Diamond plans available."
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Packages</h1>
           <div className="w-24 h-1 brand-gradient-bg mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Transparent pricing designed to fit campaigns of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className={`relative rounded-3xl overflow-hidden flex flex-col transition-all duration-300 glass-card ${
                pkg.name === PackageType.Gold
                  ? 'border-brand-orange/50 shadow-[0_0_40px_rgba(245,158,11,0.2)] z-10 transform md:scale-105'
                  : pkg.name === PackageType.Silver
                  ? 'border-white/50 shadow-[0_0_40px_rgba(255,255,255,0.2)]'
                  : pkg.name === PackageType.Diamond
                  ? 'border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.2)]'
                  : ''
              }`}
            >
              {pkg.recommended && (
                <div className="bg-brand-orange text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="p-8 text-center border-b border-white/10">
                <h3 className={`text-2xl font-bold mb-2 ${pkg.name === 'Diamond' ? 'brand-gradient-text' : 'text-white'}`}>
                    {pkg.name}
                </h3>
                <div className="text-gray-400 font-medium tracking-wide">{pkg.price}</div>
              </div>
              
              <div className="p-8 flex-grow">
                <ul className="space-y-4">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <i className={`fas fa-check-circle mt-1 mr-3 ${pkg.recommended ? 'text-brand-orange' : 'text-brand-blue'}`}></i>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Link 
                  to="/contact" 
                  className={`block w-full py-4 px-6 rounded-xl text-center font-bold transition-all duration-300 ${
                    pkg.recommended 
                      ? 'bg-gradient-to-r from-brand-orange to-red-500 text-white hover:shadow-lg' 
                      : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  Choose {pkg.name}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Packages;