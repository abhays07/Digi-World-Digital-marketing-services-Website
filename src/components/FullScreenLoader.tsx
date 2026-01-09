import React from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
        className="mb-8 relative"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-brand-orange/20 blur-2xl rounded-full"></div>
        <img src={logo} alt="Loading..." className="w-24 h-24 object-contain relative z-10" />
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Digi-World</h2>
        <div className="flex gap-1">
             <motion.div 
               animate={{ scale: [1, 1.5, 1], backgroundColor: ['#f59e0b', '#ec4899', '#f59e0b'] }}
               transition={{ duration: 1, repeat: Infinity, delay: 0 }}
               className="w-2 h-2 rounded-full bg-brand-orange" 
             />
             <motion.div 
               animate={{ scale: [1, 1.5, 1], backgroundColor: ['#ec4899', '#0ea5e9', '#ec4899'] }}
               transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
               className="w-2 h-2 rounded-full bg-brand-pink" 
             />
             <motion.div 
               animate={{ scale: [1, 1.5, 1], backgroundColor: ['#0ea5e9', '#f59e0b', '#0ea5e9'] }}
               transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
               className="w-2 h-2 rounded-full bg-brand-blue" 
             />
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
