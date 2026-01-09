import React from 'react';
import { motion } from 'framer-motion';

const JoinTeam: React.FC = () => {
  const professions = [
    { name: "Photographer", icon: "fa-camera" },
    { name: "Graphics Designer", icon: "fa-paint-brush" },
    { name: "Video Editor", icon: "fa-video" },
    { name: "Meta Ads Specialist", icon: "fa-bullhorn" }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-brand-pink/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-brand-blue/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-[2rem] p-8 md:p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-pink via-brand-orange to-brand-blue"></div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Join Our Team
          </h2>
          
          <p className="text-xl md:text-2xl text-brand-orange font-semibold mb-6 max-w-3xl mx-auto">
            If you’re a Photographer, Graphics Designer, Video Editor, or Meta Ads Specialist — We want to work with you!
          </p>

          <p className="text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            We are always looking for creative and passionate individuals to join our mission. If you believe you can create impactful digital content and manage successful campaigns, reach out to us.
          </p>

          {/* Professions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {professions.map((prof, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                className="glass-card p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-brand-dark/50 flex items-center justify-center mb-4 text-brand-blue">
                  <i className={`fas ${prof.icon} text-xl`}></i>
                </div>
                <span className="text-white font-medium">{prof.name}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.a 
            href="https://wa.me/916265180430"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-pink via-brand-orange to-brand-blue text-white font-bold rounded-full shadow-lg hover:shadow-brand-orange/50 transition-all"
          >
            <i className="fab fa-whatsapp mr-2 text-xl"></i>
            Contact for Job Opportunity
          </motion.a>

        </motion.div>
      </div>
    </section>
  );
};

export default JoinTeam;
