import React from 'react';
import { motion } from 'framer-motion';
import image from '@/assets/dgsp.png'
import Team from '../components/Team';
import SEO from '../components/SEO';

interface AboutProps {
  showTeam?: boolean;
  withSEO?: boolean;
}

const About: React.FC<AboutProps> = ({ showTeam = true, withSEO = true }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      {withSEO && (
        <SEO 
          title="About Us | Digi-World Promotions"
          description="Learn about Digi-World Promotions, our mission, our team, and our experience in political digital marketing."
        />
      )}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">About Digi-World Promotions</h1>
        <div className="w-24 h-1 brand-gradient-bg mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src={image} 
            alt="Our Team" 
            className="rounded-lg shadow-xl border border-white/10"
          />
        </motion.div>
        
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            At Digi-World Promotions, we are dedicated to transforming political communication in the digital age. 
            Based in Panna, Madhya Pradesh, we understand the nuances of regional politics while leveraging 
            global digital marketing standards.
          </p>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Our goal is simple: To provide politicians with the digital tools, strategies, and content 
            they need to connect authentically with voters and win elections.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
             <div className="glass-card p-4 rounded-lg">
               <span className="block text-3xl font-bold text-brand-pink">5+</span>
               <span className="text-sm text-gray-400">Years Experience</span>
             </div>
             <div className="glass-card p-4 rounded-lg">
               <span className="block text-3xl font-bold text-brand-blue">100+</span>
               <span className="text-sm text-gray-400">Clients Served</span>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="glass-card rounded-xl shadow-lg p-8 md:p-12 border-t-4 border-brand-dark">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Track Record</h2>
        
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2023
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Madhya Pradesh Assembly Elections 2023</h3>
                    <p className="text-gray-400 mt-2">
                        We played a pivotal role in managing digital campaigns for key candidates, focusing on hyper-local targeting and viral content creation to sway voter sentiment in critical constituencies.
                    </p>
                </div>
            </div>

             <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2025
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Bihar Assembly Elections 2025</h3>
                    <p className="text-gray-400 mt-2">
                         Formulated robust strategies and laid the digital groundwork for aspirants in the Bihar elections, focusing on youth engagement and social media penetration.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    Local
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Jila Panchayat & Local Bodies</h3>
                    <p className="text-gray-400 mt-2">
                        Successfully managed numerous Jila Panchayat campaigns, proving that digital impact is just as powerful at the grassroots level as it is on the national stage.
                    </p>
                </div>
            </div>
        </div>
      </div>
      
      {showTeam && (
        <div className="mt-20">
          <Team />
        </div>
      )}
    </motion.div>

    
  );
};

export default About;