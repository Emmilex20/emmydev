// packages/frontend/src/components/Footer.tsx
import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { FaArrowUp, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa'; // Added more icons
import { socialLinks } from '../data/portfolioData'; // Ensure socialLinks is imported

// --- ANIMATION VARIANTS ---

const footerContainerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom ease-out-back
    }
  }
};

const itemRevealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    }
  }
};

const socialIconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10
    }
  }
};

const backToTopButtonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 12,
      delay: 0.2 // Delay its appearance slightly after footer
    }
  }
};


// --- FOOTER COMPONENT ---

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear(); // Use current year

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.footer
      className="bg-gray-950 text-gray-400 py-16 md:py-20 border-t border-gray-800 relative overflow-hidden"
      variants={footerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Adjust viewport amount
    >
      {/* Background radial gradient and subtle pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-gray-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/absurd-contrast.png')] opacity-5"></div>
      </div>

      <div className="container-max-width relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg mb-10 md:mb-12
                     hover:bg-primary-700 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl
                     focus:outline-none focus:ring-4 focus:ring-primary-500/50"
          variants={backToTopButtonVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }} // Ensure button animates when in view
          whileHover={{ scale: 1.15, rotate: 5 }} // More dynamic hover
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-3xl" /> {/* Larger icon */}
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 w-full max-w-5xl text-center md:text-left">

          {/* About Section */}
          <motion.div variants={itemRevealVariants}>
            <h3 className="text-2xl font-bold text-primary-400 mb-4 font-heading">Emmanuel Agina</h3>
            <p className="text-gray-400 leading-relaxed">
              Crafting engaging digital experiences with a passion for clean code and innovative solutions. Let's build something amazing together.
            </p>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div variants={itemRevealVariants} className="md:border-l md:border-r border-gray-700 md:px-8">
            <h3 className="text-2xl font-bold text-primary-400 mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="hover:text-primary-300 transition-colors duration-300">Home</a></li>
              <li><a href="#about" className="hover:text-primary-300 transition-colors duration-300">About</a></li>
              <li><a href="#services" className="hover:text-primary-300 transition-colors duration-300">Services</a></li>
              <li><a href="#portfolio" className="hover:text-primary-300 transition-colors duration-300">Portfolio</a></li>
              <li><a href="#contact" className="hover:text-primary-300 transition-colors duration-300">Contact</a></li>
            </ul>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div variants={itemRevealVariants}>
            <h3 className="text-2xl font-bold text-primary-400 mb-4 font-heading">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center md:justify-start justify-center gap-3">
                <FaMapMarkerAlt className="text-primary-500 text-xl" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center md:justify-start justify-center gap-3">
                <FaEnvelope className="text-primary-500 text-xl" />
                <a href="mailto:aginaemmanuel6@gmail.com" className="hover:text-primary-300 transition-colors duration-300">aginaemmanuel6@gmail.com</a>
              </li>
              <li className="flex items-center md:justify-start justify-center gap-3">
                <FaPhone className="text-primary-500 text-xl" />
                <a href="tel:+2348145229141" className="hover:text-primary-300 transition-colors duration-300">+234 913 206 2212</a> {/* Replace with your actual phone number */}
              </li>
            </ul>
          </motion.div>

        </div>

        {/* Social Media Links */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-12 md:mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.6 }} // Increased stagger and delay
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-primary-400 transition-colors duration-300 text-4xl p-3 rounded-full
                         bg-gray-800 hover:bg-primary-600 shadow-xl hover:shadow-primary-glow flex items-center justify-center
                         border border-gray-700 hover:border-primary-500"
              variants={socialIconVariants}
              whileHover={{ scale: 1.25, rotate: 20, transition: { type: "spring", stiffness: 300, damping: 10 } }} // More pronounced rotation
              whileTap={{ scale: 0.9 }}
              title={link.label}
              aria-label={link.label}
            >
              {React.createElement(link.icon)}
            </motion.a>
          ))}
        </motion.div>

        {/* Separator Line */}
        <motion.div
          className="w-full h-px bg-gray-700 mt-12 md:mt-16 mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
          viewport={{ once: true, amount: 0.8 }}
        ></motion.div>

        {/* Copyright and Credit */}
        <motion.p
          className="text-base text-gray-500 mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          &copy; {currentYear} Emmanuel Agina. All rights reserved.
        </motion.p>
        <motion.p
          className="text-sm text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Handcrafted with <span className="text-red-500 animate-pulse">❤️</span> in Lekki, Lagos.
        </motion.p>
      </div>
    </motion.footer>
  );
};

export default Footer;