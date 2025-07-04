/* eslint-disable @typescript-eslint/no-explicit-any */
// packages/frontend/src/sections/Contact.tsx
import React, { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Import more icons
import SectionContainer from '../components/SectionContainer';
import SectionHeader from '../components/SectionHeader';
import { socialLinks } from '../data/portfolioData';
import api from '../services/api';

// --- ANIMATION VARIANTS ---

const sectionHeaderVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom ease-out
    }
  }
};

const formVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring", // Use spring for a bouncier feel
      stiffness: 70,
      damping: 20,
      delay: 0.3
    }
  }
};

const infoVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 20,
      delay: 0.5
    }
  }
};

const socialIconVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.7 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10
    }
  }
};

const textRevealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
};

// --- CONTACT COMPONENT ---

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitMessage(null);
    setIsSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    setIsSuccess(null);

    try {
      const response = await api.post('/api/contact', formData);

      setSubmitMessage(response.data.message || 'Message sent successfully! I will get back to you soon.');
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Form submission error:', error);
      setIsSuccess(false);

      if (error.response && error.response.data && error.response.data.message) {
        setSubmitMessage(error.response.data.message);
      } else {
        setSubmitMessage('Failed to send message. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionContainer id="contact" className="bg-dark text-light py-20 relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-dark"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <div className="relative z-10"> {/* Ensure content is above the background */}
        <SectionHeader
          title="Get In Touch"
          subtitle="Have a project in mind or just want to chat? Feel free to reach out!"
          variants={sectionHeaderVariants} // Apply header animation
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto px-4">
          {/* Contact Form */}
          <motion.div
            className="bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl border border-gray-700
                       hover:border-primary-500 hover:shadow-primary-glow transition-all duration-500 ease-out-back relative
                       group"
            variants={formVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-xl pointer-events-none
                            bg-gradient-to-br from-primary-600/10 via-transparent to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

            <h3 className="text-3xl font-heading font-semibold text-primary-400 mb-8 text-center">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 text-lg mb-2 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 text-light
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none
                             transition-all duration-300 placeholder-gray-500 shadow-inner shadow-gray-950/50"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 text-lg mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 text-light
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none
                             transition-all duration-300 placeholder-gray-500 shadow-inner shadow-gray-950/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-300 text-lg mb-2 font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 text-light
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none
                             transition-all duration-300 placeholder-gray-500 shadow-inner shadow-gray-950/50"
                  placeholder="Project Inquiry, Collaboration, etc."
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-300 text-lg mb-2 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 text-light
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none
                             transition-all duration-300 placeholder-gray-500 resize-y shadow-inner shadow-gray-950/50"
                  placeholder="Your detailed message..."
                ></textarea>
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center gap-3
                           relative overflow-hidden
                           hover:bg-primary-700 transition-all duration-300 transform hover:-translate-y-1
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 15px rgba(74, 222, 128, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-2xl" /> Sending...
                  </>
                ) : (
                  'Send Message'
                )}
                {/* Subtle shimmer effect on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0
                                  group-hover:opacity-100 transition-all duration-700 translate-x-full group-hover:translate-x-0"></span>
              </motion.button>
              <AnimatePresence>
                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 10 }}
                    className={`mt-4 p-4 rounded-lg text-center flex items-center justify-center gap-3
                                ${isSuccess ? 'bg-green-900/40 text-green-400 border border-green-700' : 'bg-red-900/40 text-red-400 border border-red-700'}`}
                  >
                    {isSuccess ? <FaCheckCircle className="text-2xl" /> : <FaExclamationCircle className="text-2xl" />}
                    <p className="text-lg font-semibold">{submitMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Contact Info & Social Media */}
          <motion.div
            className="flex flex-col justify-center items-center md:items-start text-center md:text-left
                       bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl border border-gray-700
                       hover:border-primary-500 hover:shadow-primary-glow transition-all duration-500 ease-out-back relative
                       group"
            variants={infoVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-xl pointer-events-none
                            bg-gradient-to-br from-primary-600/10 via-transparent to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

            <motion.h3
              className="text-3xl font-heading font-semibold text-primary-400 mb-8"
              variants={textRevealVariants}
              viewport={{ once: true, amount: 0.3 }}
            >
              Connect With Me
            </motion.h3>
            <motion.p
              className="text-lg text-gray-300 mb-6 max-w-md md:max-w-none"
              variants={textRevealVariants}
              viewport={{ once: true, amount: 0.3 }}
            >
              I'm always open to new opportunities, collaborations, or just a friendly chat. Feel free to connect with me on these platforms:
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center md:justify-start gap-6 mt-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.5 }}
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 transition-colors duration-300 text-5xl p-2 rounded-full
                             bg-gray-700 hover:bg-primary-500 shadow-lg hover:shadow-primary-glow-sm flex items-center justify-center"
                  variants={socialIconVariants}
                  whileHover={{ scale: 1.15, rotate: 15, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  whileTap={{ scale: 0.9 }}
                  title={link.label}
                >
                  {React.createElement(link.icon)}
                </motion.a>
              ))}
            </motion.div>
            <motion.div
              className="mt-10 text-center md:text-left"
              variants={textRevealVariants}
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="text-xl text-gray-300 mb-2 font-medium">
                Or send an email directly:
              </p>
             <motion.a
              href="mailto:aginaemmanuel6@gmail.com"
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-300
             inline-block border-b-2 border-primary-500 hover:border-primary-300 pb-1
             text-xl sm:text-2xl break-all" // Added responsive font size and break-all
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              >
                aginaemmanuel6@gmail.com
            </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Contact;