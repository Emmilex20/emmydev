// packages/frontend/src/sections/Hero.tsx
import React, { useEffect, useRef } from 'react';
import { motion, type Variants } from 'framer-motion'; // Import 'Variants' type
import { TypeAnimation } from 'react-type-animation';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  const [particlesInit, setParticlesInit] = React.useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setParticlesInit(true);
    });
  }, []);

  // --- Animation Variants ---
  const fadeInVariants: Variants = { // Explicitly type Variants
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const textRevealVariants: Variants = { // Explicitly type Variants
    hidden: { opacity: 0, y: 50, skewY: 10 },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: {
        duration: 0.8,
        // FIX: Explicitly cast the cubic-bezier array to satisfy TypeScript
        ease: [0.6, 0.05, 0.04, 0.9] as [number, number, number, number]
      }
    }
  };

  const typeAnimationVariants: Variants = { // Explicitly type Variants
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 1.2,
        duration: 0.5
      }
    }
  };

  const buttonGroupVariants: Variants = { // Explicitly type Variants
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2.5,
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const buttonItemVariants: Variants = { // Explicitly type Variants
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // --- Main Render ---
  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-screen flex items-center justify-center bg-dark text-light overflow-hidden z-0"
    >
      {/* Dynamic Particle Background */}
      {particlesInit && (
        <Particles
          id="tsparticles"
          className="absolute inset-0 z-0"
          options={{
            background: {
              color: {
                value: "#1a202c",
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#4ADE80",
              },
              links: {
                color: "#6B7280",
                distance: 150,
                enable: true,
                opacity: 0.4,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      )}

      {/* Hero Content */}
      <motion.div
        className="text-center z-10 p-4 md:p-8 relative"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <motion.h1
  className="text-5xl md:text-7xl lg:text-8xl font-heading mb-4 leading-tight text-primary-300 drop-shadow-lg"
  variants={textRevealVariants}
>
  Hello, I'm{" "}
  <span className="text-primary-400 font-extrabold">Emmanuel Agina</span>
</motion.h1>

        <motion.p
          className="text-2xl md:text-4xl lg:text-5xl font-light mb-8 text-white drop-shadow-md"
          variants={typeAnimationVariants}
        >
          <TypeAnimation
            sequence={[
              'I build seamless user experiences.', 1500,
              'I craft robust backend systems.', 1500,
              'I am a Full Stack Web Developer.', 1500,
              () => { /* console.log('Sequence completed'); */ }
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            speed={40}
            deletionSpeed={60}
            className="inline-block"
          />
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-6 mt-10"
          variants={buttonGroupVariants}
        >
          <motion.a
            href="#projects"
            className="py-4 px-10 bg-primary-600 text-white rounded-full text-xl font-semibold hover:bg-primary-700 transition-colors duration-300 shadow-lg transform hover:-translate-y-1 active:scale-95"
            variants={buttonItemVariants}
            whileHover={{ scale: 1.05, boxShadow: '0px 0px 20px rgba(74, 222, 128, 0.8)' }}
            whileTap={{ scale: 0.98 }}
          >
            View Portfolio
          </motion.a>
          <motion.a
            href="#contact"
            className="py-4 px-10 border-2 border-primary-600 text-primary-400 rounded-full text-xl font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 shadow-lg transform hover:-translate-y-1 active:scale-95"
            variants={buttonItemVariants}
            whileHover={{ scale: 1.05, borderColor: 'rgba(74, 222, 128, 0.8)', boxShadow: '0px 0px 20px rgba(74, 222, 128, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Me
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;