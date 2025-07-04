/* eslint-disable @typescript-eslint/no-explicit-any */
// packages/frontend/src/components/SectionHeader.tsx
import React from 'react';
import { motion, type Variants } from 'framer-motion'; // Import 'type Variants'

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  // Make variants prop optional, allowing parent to pass them or not
  variants?: Variants;
  // Optionally, you might want to adjust the default viewport amount for better control
  viewportAmount?: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  variants, // Destructure the new variants prop
  viewportAmount = 0.5, // Default viewport amount
}) => {
  // Define default animations if no variants are passed from parent
  // These will act as a fallback or can be combined with parent variants
  const defaultContainerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const defaultTitleVariants: Variants = {
    hidden: { scale: 0.8 },
    visible: {
      scale: 1,
      transition: { delay: 0.2, duration: 0.6, ease: "easeOut" }
    }
  };

  const defaultSubtitleVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.4, duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="text-center mb-12 px-4" // Added px-4 for better small screen padding
      initial="hidden" // Always start from hidden for consistency
      whileInView="visible" // Always animate when in view
      viewport={{ once: true, amount: viewportAmount }} // Use viewportAmount prop
      // Apply parent-provided variants, otherwise use defaults
      variants={variants || defaultContainerVariants}
    >
      <motion.h2
        className="text-5xl md:text-6xl font-extrabold font-heading text-primary-400 mb-4 tracking-tight leading-tight" // Increased text size for impact
        // If parent variants define specific child animations (e.g., variants.h2), use them.
        // Otherwise, use the default title variants.
        variants={variants && (variants as any).h2 ? (variants as any).h2 : defaultTitleVariants}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto" // Increased text size and max-width for subtitle
          // If parent variants define specific child animations (e.g., variants.p), use them.
          // Otherwise, use the default subtitle variants.
          variants={variants && (variants as any).p ? (variants as any).p : defaultSubtitleVariants}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeader;