/* eslint-disable @typescript-eslint/no-unused-vars */
// packages/frontend/src/components/Navbar.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { socialLinks } from '../data/portfolioData';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth

const navLinks = [
  { name: 'Home', href: '/#hero', isRouterLink: true },
  { name: 'About', href: '/#about', isRouterLink: false }, // Keep false if these are in-page anchors
  { name: 'Skills', href: '/#skills', isRouterLink: false },
  { name: 'Projects', href: '/#projects', isRouterLink: false },
  { name: 'Contact', href: '/#contact', isRouterLink: false },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollDirection = useScrollDirection({ threshold: 50 });
  const { isAdminAuthenticated, logout } = useAuth(); // <-- Destructure from useAuth

  const navbarY = scrollDirection === 'down' ? -100 : 0;

  const menuVariants: Variants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
        staggerChildren: 0.07,
        delayChildren: 0.2,
      }
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    }
  };

  const linkVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { y: 20, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-colors duration-300
        ${isScrolled ? 'bg-dark bg-opacity-90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}
      `}
      initial={{ y: -100 }}
      animate={{ y: navbarY }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container-max-width flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Home link */}
        <motion.a
          href="/#hero"
          className="text-primary-400 font-heading text-3xl md:text-4xl font-extrabold tracking-wider hover:text-primary-300 transition-colors duration-300 cursor-pointer"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          E.A. Dev
        </motion.a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 lg:space-x-12 items-center">
          {navLinks.map((link, index) => (
            <motion.li
              key={link.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.4, duration: 0.4 }}
            >
              {/* Ensure /#hero is correctly a Link, others are anchors for same-page scroll */}
              {link.isRouterLink ? (
                <Link
                  to={link.href}
                  className="text-light hover:text-primary-400 transition-all duration-300 relative group text-lg lg:text-xl font-medium cursor-pointer"
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-light hover:text-primary-400 transition-all duration-300 relative group text-lg lg:text-xl font-medium cursor-pointer"
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              )}
            </motion.li>
          ))}
          {/* Admin/Logout Link for Desktop Navigation - Conditional Rendering */}
          <motion.li
            key="admin-logout-desktop" // Use a consistent key
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * navLinks.length + 0.4, duration: 0.4 }}
          >
            {isAdminAuthenticated ? (
              <button
                onClick={logout} // Call the logout function
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-300 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer" // Add cursor-pointer
              >
                Logout
              </button>
            ) : (
              <Link
                to="/admin"
                className="text-light hover:text-primary-400 transition-all duration-300 relative group text-lg lg:text-xl font-medium cursor-pointer" // Add cursor-pointer
              >
                Admin
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            )}
          </motion.li>
        </ul>

        {/* Mobile Hamburger Menu Button */}
        <div className="md:hidden">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="text-primary-400 text-3xl focus:outline-none p-2 rounded-md hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-dark bg-opacity-95 backdrop-blur-lg flex flex-col items-center justify-center space-y-8 z-40"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button for mobile menu */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-primary-400 text-4xl p-2 rounded-md hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              aria-label="Close navigation menu"
            >
              <FaTimes />
            </button>
            <ul className="flex flex-col items-center space-y-8">
              {navLinks.map((link, _index) => (
                <motion.li
                  key={link.name}
                  variants={linkVariants}
                >
                  {link.isRouterLink ? (
                    <Link
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-light text-4xl font-heading font-semibold hover:text-primary-400 transition-colors duration-300 block py-2 cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-light text-4xl font-heading font-semibold hover:text-primary-400 transition-colors duration-300 block py-2 cursor-pointer"
                    >
                      {link.name}
                    </a>
                  )}
                </motion.li>
              ))}
              {/* Admin/Logout Link for Mobile Navigation - Conditional Rendering */}
              <motion.li
                key="admin-logout-mobile" // Use a consistent key
                variants={linkVariants}
              >
                {isAdminAuthenticated ? (
                  <button
                    onClick={() => {
                      logout(); // Call logout
                      setIsOpen(false); // Close menu after logout
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md transition-colors duration-300 text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer" // Adjust styling for mobile if needed
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-light text-4xl font-heading font-semibold hover:text-primary-400 transition-colors duration-300 block py-2 cursor-pointer"
                  >
                    Admin
                  </Link>
                )}
              </motion.li>
            </ul>
            <div className="flex space-x-7 mt-10">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light hover:text-primary-400 text-4xl transition-colors duration-300 cursor-pointer"
                  variants={linkVariants}
                  whileHover={{ scale: 1.25, rotate: 6 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <link.icon />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;