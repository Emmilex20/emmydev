// packages/frontend/src/sections/About.tsx
import React, { useEffect, useRef  } from 'react';
import { motion, useInView, useSpring, useTransform, type Variants } from 'framer-motion'; // <-- Import new hooks
import SectionContainer from '../components/SectionContainer';
import SectionHeader from '../components/SectionHeader';
import emmanuelProfile from '../assets/images/Emma-1.jpg'; // Ensure this path is correct
import { aboutData } from '../data/portfolioData'; // Ensure this path is correct

// --- Animation Variants ---

// Variants for main text paragraphs
const textVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1], // Custom ease-out for a snappier feel
    }
  }
};

// Variants for image entrance
const imageVariants: Variants = {
  hidden: { opacity: 0, x: -100, rotateY: 90, scale: 0.8 }, // Start rotated and scaled down
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.2, 0.7, 0.4, 1], // More dynamic ease for image
      delay: 0.2,
    }
  }
};

// Variants for highlights container (staggering children)
const highlightsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Increased stagger for more noticeable effect
      delayChildren: 0.5, // Delay before children start animating
    }
  }
};

// Variants for individual highlight items
const highlightItemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.7 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.17, 0.67, 0.83, 0.67], // Ease-in-out-back for a slight bounce
    }
  }
};

// Component for animating numbers
interface AnimatedNumberProps {
  value: number;
  delay: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 }); // Trigger when 50% in view

  const spring = useSpring(0, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [inView, spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
};


const About: React.FC = () => {
  // Ref for the highlights section to trigger number animation
  const highlightsRef = useRef(null);
  const highlightsInView = useInView(highlightsRef, { once: true, amount: 0.5 });


  return (
    <SectionContainer id="about" className="bg-gradient-to-br from-gray-950 to-gray-800 text-light py-20 overflow-hidden">
      <SectionHeader
        title="About Me"
        subtitle={aboutData.headline}
      />

      <div className="flex flex-col md:flex-row items-center gap-12 mt-16 max-w-6xl mx-auto px-4">
        {/* Image Section */}
        <motion.div
          className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative group overflow-hidden rounded-full shadow-2xl border-4 border-primary-500 transform transition-all duration-500 hover:scale-105"
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <img
            src={emmanuelProfile}
            alt="Emmanuel Agina"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1" // Subtle rotate on hover
          />
          {/* Enhanced Subtle overlay on hover and pulsing border */}
          <motion.div
            className="absolute inset-0 bg-primary-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full z-10"
          ></motion.div>
          {/* Optional: Add a subtle inner shadow or ring for depth */}
          <div className="absolute inset-0 rounded-full ring-4 ring-primary-400 ring-opacity-20 blur-sm animate-pulse-slow"></div>
        </motion.div>

        {/* Content Section */}
        <div className="flex-grow text-center md:text-left">
          {aboutData.bioParagraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              className="text-lg md:text-xl leading-relaxed mb-6 text-gray-300"
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 * index, duration: 0.7, ease: [0.33, 1, 0.68, 1] as const }} // Apply custom ease here too
            >
              {paragraph}
            </motion.p>
          ))}

          {/* Highlights */}
          <motion.div
            ref={highlightsRef} // Attach ref for individual number animation trigger
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
            variants={highlightsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            {aboutData.highlights.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-xl text-center border border-gray-700 hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
                variants={highlightItemVariants}
                whileHover={{ scale: 1.03, boxShadow: '0px 10px 25px rgba(0,0,0,0.5), 0px 0px 20px rgba(74, 222, 128, 0.4)' }} // More pronounced shadow & glow
                whileTap={{ scale: 0.98 }}
              >
                {/* Background gradient on hover for subtle pop */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary-950 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

                <motion.h3 className="text-primary-400 text-5xl font-bold mb-2 relative z-10">
                  {highlightsInView && <AnimatedNumber value={item.value} delay={0.2 + 0.15 * index} />}
                  {/* If you prefer to manually animate without AnimatedNumber component, or for non-numeric highlights:
                  <motion.span
                     initial={{ width: 0 }}
                     whileInView={{ width: '100%' }}
                     transition={{ duration: 1.5, ease: "easeOut" as const, delay: 0.2 + 0.15 * index }}
                     className="inline-block relative overflow-hidden"
                   >
                     <motion.span
                       initial={{ x: '-100%' }}
                       whileInView={{ x: '0%' }}
                       transition={{ duration: 1.5, ease: "easeOut" as const, delay: 0.2 + 0.15 * index }}
                       className="inline-block relative text-primary-400"
                     >
                       {item.value}
                     </motion.span>
                     <motion.span
                       initial={{ left: '0%' }}
                       whileInView={{ left: '100%' }}
                       transition={{ duration: 1.5, ease: "easeOut" as const, delay: 0.2 + 0.15 * index }}
                       className="absolute top-0 bottom-0 left-0 right-0 bg-gray-800"
                     ></motion.span>
                   </motion.span>
                  */}
                </motion.h3>
                <p className="text-gray-300 text-lg relative z-10">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default About;