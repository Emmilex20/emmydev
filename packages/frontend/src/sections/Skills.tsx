// packages/frontend/src/sections/Skills.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import SectionContainer from '../components/SectionContainer';
import SectionHeader from '../components/SectionHeader';

// Import skill categories and types from your data file
import { skillCategories } from '../data/portfolioData';




// --- Animation Variants ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Slightly increased stagger
      delayChildren: 0.3 // Increased delay before children start
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4, // Longer exit duration
      ease: "easeOut" as const
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 40, opacity: 0, scale: 0.8 }, // Slide up, fade in, scale in
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6, // Slower entrance
      ease: [0.3, 0.7, 0.4, 1], // Custom bouncy ease-out
    }
  },
  exit: {
    y: -30, // Slide up more on exit
    opacity: 0,
    scale: 0.7, // Scale down on exit
    transition: {
      duration: 0.4, // Match exit duration with container
      ease: "easeIn" as const
    }
  }
};

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].name);

  const filteredSkills = skillCategories.find(
    (cat) => cat.name === activeCategory
  )?.skills || [];

  return (
    <SectionContainer id="skills" className="bg-gradient-to-b from-gray-950 to-gray-800 text-light py-20">
      <SectionHeader
        title="My Skills"
        subtitle="A snapshot of my technical expertise across the full stack."
      />

      {/* Category Tabs */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-12 px-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {skillCategories.map((category) => (
          <motion.button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={`py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300
              ${activeCategory === category.name
                ? 'bg-primary-600 text-white shadow-lg ring-2 ring-primary-400' // Active state
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' // Inactive state
              }`}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(74, 222, 128, 0.4)' }} // Glow on hover
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Skills Grid with AnimatePresence for tab transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory} // Key change triggers exit/enter animations
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit" // Animate out when changing category
          // Removed viewport prop here as AnimatePresence handles visibility transitions
        >
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name} // Using skill name as key for stable identification
              className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center justify-center text-center border border-gray-700
                         hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer
                         relative overflow-hidden group" // Added 'group' class for hover effects
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: '0px 12px 30px rgba(0,0,0,0.6), 0px 0px 25px rgba(74, 222, 128, 0.5)' // More pronounced shadow & glow
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background gradient on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.25 }} // More visible gradient on hover
                transition={{ duration: 0.3 }}
              ></motion.div>

              <div className="relative z-10"> {/* Ensure content is above background effect */}
                {skill.icon && (
                  <motion.div
                    className="text-6xl mb-4"
                    style={{ color: skill.color }} // Apply icon specific color
                    whileHover={{ scale: 1.2, rotate: 10 }} // Icon animation on hover
                    transition={{ duration: 0.2 }}
                  >
                    {/* Render the icon component directly */}
                    {React.createElement(skill.icon)}
                  </motion.div>
                )}
                <h3 className="text-xl font-semibold text-white mt-2">{skill.name}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionContainer>
  );
};

export default Skills;