import React from 'react';
import { motion } from 'framer-motion';
import abhay from '@/assets/abhay.png'
import vikram from '@/assets/vikram.jpg'

const Team: React.FC = () => {
  const teamMembers = [
    {
      name: "Vikram Singh Rajpoot",
      designation: "Founder",
      about: "Experienced Social Media Manager, Client Relationship & Development Head.",
      phone: "+91 6265180430",
      whatsapp: "https://wa.me/+916265180430",
      image: vikram // Placeholder
    },
    {
      name: "Abhay Singh Rajput",
      designation: "Co-Founder",
      about: "Experienced Digital Marketing Specialist & Video Editor, Client Growth Manager and Strategist.",
      phone: "+91 9340056987",
      whatsapp: "https://wa.me/+919340056987",
      image: abhay // Placeholder
    }
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Meet Our Leaders
          </motion.h2>
          <div className="w-24 h-1 brand-gradient-bg mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            The minds behind the strategies that win elections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass-card rounded-3xl overflow-hidden group border border-white/10 hover:border-brand-orange/30 transition-all duration-300"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full p-1 brand-gradient-bg">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full rounded-full object-cover border-4 border-brand-dark"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-brand-dark rounded-full p-2 border border-white/10">
                    <i className="fas fa-check-circle text-brand-blue text-lg"></i>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-brand-orange transition-colors">
                  {member.name}
                </h3>
                <p className="text-brand-pink font-medium text-sm tracking-wider uppercase mb-4">
                  {member.designation}
                </p>
                
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {member.about}
                </p>

                <div className="w-full pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center space-x-2 mb-4 text-gray-300">
                    <i className="fas fa-phone-alt text-brand-orange text-sm"></i>
                    <span className="text-sm font-medium">{member.phone}</span>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <a 
                      href={member.whatsapp} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all transform hover:scale-110"
                    >
                      <i className="fab fa-whatsapp text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
