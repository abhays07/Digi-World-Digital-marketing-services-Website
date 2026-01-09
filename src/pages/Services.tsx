import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

interface ServicesProps {
  withSEO?: boolean;
}

const Services: React.FC<ServicesProps> = ({ withSEO = true }) => {
  const services = [
    {
      title: "Political Strategy & Consulting",
      desc: "Data-driven roadmaps to navigate complex political landscapes and voter demographics.",
      icon: "fa-chess-knight",
      color: "text-brand-pink"
    },
    {
      title: "Social Media Management",
      desc: "Complete handling of Facebook, Twitter, Instagram, and YouTube accounts to maintain an active, engaging presence.",
      icon: "fa-users",
      color: "text-brand-orange"
    },
    {
      title: "Graphics Designing",
      desc: "High-quality posters, banners, and infographics designed to go viral on WhatsApp and social media.",
      icon: "fa-pencil-ruler",
      color: "text-brand-blue"
    },
    {
      title: "Video Editing & Production",
      desc: "Professional editing for reels, interviews, and campaign highlights that capture attention instantly.",
      icon: "fa-video",
      color: "text-brand-pink"
    },
    {
      title: "Election Campaign Management",
      desc: "End-to-end digital war room setup, volunteer coordination tools, and day-to-day campaign tracking.",
      icon: "fa-tasks",
      color: "text-brand-orange"
    },
    {
      title: "Facebook & Instagram Ads",
      desc: "Precision targeted advertising to reach voters by age, location, and interests.",
      icon: "fa-ad",
      color: "text-brand-blue"
    },
    {
      title: "Content Writing",
      desc: "Compelling speeches, captions, press releases, and slogans that resonate with the public.",
      icon: "fa-pen-fancy",
      color: "text-brand-pink"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="py-16 min-h-screen"
    >
      {withSEO && (
        <SEO 
          title="Our Services | Digi-World Promotions"
          description="Explore our political marketing services: Social Media Management, Campaign Strategy, Video Production, and more."
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Our Services
          </motion.h1>
          <div className="w-24 h-1 brand-gradient-bg mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg font-light">
            Comprehensive digital solutions tailored for the modern political landscape.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden group"
            >
              <div className="p-8">
                <div className={`w-14 h-14 bg-white/5 rounded-full flex items-center justify-center ${service.color} mb-6 border border-white/10 group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${service.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-orange transition-colors">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Services;