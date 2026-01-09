import React from 'react';
import { motion } from 'framer-motion';
import mp from "@/assets/mp.svg"
import bihar from "@/assets/bihar.svg"
import panchayat from "@/assets/panchayat.svg"
import SEO from '../components/SEO';

interface PortfolioProps {
  withSEO?: boolean;
}

const Portfolio: React.FC<PortfolioProps> = ({ withSEO = true }) => {
  // ... projects array
  const projects = [
    {
      title: "MP Assembly Elections 2023",
      category: "State Election",
      image: mp,
      description: "Managed digital outreach for 5 constituencies. Increased candidate reach by 300% through localized video content and WhatsApp campaigns.",
      tags: ["Campaign Management", "Video Editing", "Ads"]
    },
    {
      title: "Bihar Election 2025",
      category: "Strategic Planning",
      image: bihar,
      description: "Developing the digital roadmap for aspiring candidates, focusing on youth demographic targeting and narrative building.",
      tags: ["Strategy", "Content Writing", "Branding"]
    },
    {
      title: "Panchayat Elections",
      category: "Local Election",
      image: panchayat,
      description: "A grassroots campaign that utilized low-cost, high-impact social media creatives to secure a victory in a competitive ward.",
      tags: ["Graphics", "Social Media", "Local"]
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
          title="Portfolio | Digi-World Promotions"
          description="View our successful political campaigns and case studies. See how we help politicians win elections."
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Our Portfolio</h1>
          <div className="w-24 h-1 brand-gradient-bg mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            A glimpse into our successful campaigns and the impact we create.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-xl overflow-hidden shadow-lg group border border-white/10"
            >
              <div className="relative overflow-hidden h-48">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-0 right-0 bg-brand-orange text-white text-xs font-bold px-3 py-1 m-2 rounded shadow-md">
                  {project.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={tag} className={`px-2 py-1 text-xs rounded-md font-medium bg-white/10 ${i % 2 === 0 ? 'text-brand-pink' : 'text-brand-blue'}`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Portfolio;