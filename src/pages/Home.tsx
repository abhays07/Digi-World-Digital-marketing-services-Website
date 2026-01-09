import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import About from './About';
import Services from './Services';
import Packages from './Packages';
import Portfolio from './Portfolio';
import Contact from './Contact';
import Team from '../components/Team';
import JoinTeam from '../components/JoinTeam';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      <SEO 
        title="Digi-World Promotions | Political Digital Marketing Agency"
        description="Leading political digital marketing agency in Madhya Pradesh & Uttar Pradesh. We specialize in election campaigns, social media management, and voter outreach."
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        
        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block px-5 py-2 rounded-full glass-card text-sm font-medium text-brand-orange shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            🚀 Powering Modern Political Campaigns
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight"
          >
            Win Hearts. <br/>
            <span className="brand-gradient-text drop-shadow-2xl">Win Elections.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-12 leading-relaxed font-light"
          >
            The strategic partner for <span className="text-white font-semibold">future leaders</span>. 
            We combine data science with viral storytelling to amplify your voice.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Link to="/contact" className="px-8 py-4 bg-gradient-to-r from-brand-pink via-brand-orange to-brand-blue text-white font-bold rounded-full shadow-lg hover:shadow-brand-blue/50 transform hover:scale-105 transition-all text-center">
              Start Your Campaign
            </Link>
            <Link to="/services" className="px-8 py-4 glass-card text-white font-bold rounded-full hover:bg-white/10 transition-colors text-center">
              Explore Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats/Trust Section (Glass) */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-4">
              <h3 className="text-5xl font-bold text-white mb-2">5+</h3>
              <p className="text-brand-pink font-semibold uppercase tracking-widest text-xs">Years Experience</p>
            </div>
            <div className="p-4">
              <h3 className="text-5xl font-bold text-white mb-2">100+</h3>
              <p className="text-brand-orange font-semibold uppercase tracking-widest text-xs">Politicians Served</p>
            </div>
            <div className="p-4">
              <h3 className="text-5xl font-bold text-white mb-2">100%</h3>
              <p className="text-brand-blue font-semibold uppercase tracking-widest text-xs">Winning Commitment</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About Section */}
      <About showTeam={false} withSEO={false} />

      {/* Brief Services */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
            >
              Why Choose Digi-World?
            </motion.h2>
            <div className="w-24 h-1 brand-gradient-bg mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              We specialize in the political landscape of Madhya Pradesh and Uttar Pradesh, understanding the pulse of the local voter.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: 'fa-bullhorn', color: 'text-brand-pink', bg: 'bg-brand-pink/10', title: 'Campaign Management', desc: 'End-to-end management from strategy to execution.' },
              { icon: 'fa-paint-brush', color: 'text-brand-orange', bg: 'bg-brand-orange/10', title: 'Creative Graphics', desc: 'Eye-catching visuals that convey your message instantly.' },
              { icon: 'fa-chart-line', color: 'text-brand-blue', bg: 'bg-brand-blue/10', title: 'Social Growth', desc: 'Targeted ads and content to grow your follower base.' },
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="glass-card glass-card-hover p-10 rounded-3xl transition-all group"
              >
                <div className={`w-20 h-20 ${service.bg} rounded-2xl flex items-center justify-center ${service.color} mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                  <i className={`fas ${service.icon} text-3xl`}></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">{service.desc}</p>
                <Link to="/services" className={`text-sm font-bold uppercase tracking-wider ${service.color} hover:text-white transition-colors flex items-center`}>
                  Learn More <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Full Services Section */}
      <Services withSEO={false} />

      {/* Packages Section */}
      <Packages withSEO={false} />

      {/* Portfolio Section */}
      <Portfolio withSEO={false} />

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border-t border-white/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-pink via-brand-orange to-brand-blue"></div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">Ready to <span className="text-brand-orange">Win?</span></h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Let's discuss how we can help you reach more voters and secure your victory with a modern digital strategy.
          </p>
          <Link to="/contact" className="inline-block px-12 py-5 bg-white text-brand-dark font-bold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transform hover:-translate-y-1 transition-all">
            Contact Us Now
          </Link>
        </div>
      </section>
      {/* Team Section */}
      <Team />
             {/* Join Team Section */}
      <JoinTeam />
      {/* Contact Section */}
      <Contact withSEO={false} />
    </div>
  );
};

export default Home;