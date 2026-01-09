import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { ContactForm } from '../types';
import SEO from '../components/SEO';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

interface ContactProps {
  withSEO?: boolean;
}

const Contact: React.FC<ContactProps> = ({ withSEO = true }) => {
  // ... state
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    mobileNumber: '',
    email: '',
    place: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      // Map form data to EmailJS template variables
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        mobile_number: formData.mobileNumber,
        place: formData.place,
      };

      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      // console.log('EmailJS result:', result);

      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({
        name: '',
        mobileNumber: '',
        email: '',
        place: '',
      });
    } catch (error: unknown) {
      console.error('EmailJS Error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-16 min-h-screen flex items-center"
    >
      {withSEO && (
        <SEO 
          title="Contact Us | Digi-World Promotions"
          description="Get in touch with Digi-World Promotions for your political campaign needs. Contact us via phone, email, or WhatsApp."
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 glass-card rounded-[2rem] overflow-hidden shadow-2xl">

          {/* Contact Info Side */}
          <div className="p-10 md:p-16 flex flex-col justify-between relative overflow-hidden bg-brand-dark/40">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 text-white">Let's Discuss Your Campaign</h2>
              <p className="text-gray-300 mb-10 leading-relaxed text-lg">
                Whether you are planning for an upcoming election or need to boost your current digital presence,
                Digi-World Promotions is here to help.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand-pink/20 transition-colors">
                    <i className="fas fa-map-marker-alt text-brand-pink text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">Location</h3>
                    <p className="text-gray-400">Bhopal, Madhya Pradesh, India</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange/20 transition-colors">
                    <i className="fas fa-phone text-brand-orange text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">Phone</h3>
                    <p className="text-gray-400">
                      <a href="tel:+916265180430" className="hover:text-white transition-colors">+91 6265180430</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand-blue/20 transition-colors">
                    <i className="fas fa-envelope text-brand-blue text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">Email</h3>
                    <p className="text-gray-400">
                      <a href="mailto:contact@digiworldpromotions.in" className="hover:text-brand-blue transition-colors">
                        contact@digiworldpromotions.in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 relative z-10">
              <h3 className="font-semibold mb-6 text-gray-300 uppercase tracking-widest text-sm">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61559011646766" 
                  className="w-12 h-12 border border-gray-600 rounded-full flex items-center justify-center hover:bg-brand-pink hover:border-transparent hover:text-white transition-all hover:scale-110" target="_blank"
                >
                  <i className="fab fa-facebook-f text-lg"></i>
                </a>
                <a
                  href="https://www.instagram.com/dw_promotions/"
                  className="w-12 h-12 border border-gray-600 rounded-full flex items-center justify-center hover:bg-brand-orange hover:border-transparent hover:text-white transition-all hover:scale-110" target="_blank"
                >
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a
                  href="https://wa.me/916265180430"
                  className="w-12 h-12 border border-gray-600 rounded-full flex items-center justify-center hover:bg-brand-blue hover:border-transparent hover:text-white transition-all hover:scale-110" target="_blank"
                >
                  <i className="fab fa-whatsapp text-lg"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-10 md:p-16 bg-white/5 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition focus:bg-white/10"
                  placeholder="Enter Your Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition focus:bg-white/10"
                  placeholder="Enter Your 10 digit Mobile Number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition focus:bg-white/10"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Place / City</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition focus:bg-white/10"
                  placeholder="e.g. Bhopal"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 brand-gradient-bg text-white font-bold rounded-xl shadow-lg hover:shadow-brand-orange/40 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
