// packages/frontend/src/components/SectionContainer.tsx
import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionContainerProps {
  id: string;
  children: ReactNode;
  className?: string; // Optional: for adding extra Tailwind classes
}

const SectionContainer: React.FC<SectionContainerProps> = ({ id, children, className }) => {
  return (
    <motion.section
      id={id}
      // Apply consistent padding for all sections across different screen sizes
      // and ensure content is centered within a max-width container.
      // 'relative' and 'overflow-hidden' are good defaults for sections
      // that might contain animated elements or background effects.
      className={`section-padding container-max-width relative overflow-hidden ${className || ''}`}
      
      // Framer Motion animation for when the section scrolls into view
      initial={{ opacity: 0, y: 50 }} // Starts invisible and slightly below its final position
      whileInView={{ opacity: 1, y: 0 }} // Animates to full opacity and original position
      transition={{ duration: 0.8, ease: "easeOut" }} // Smooth transition over 0.8 seconds
      viewport={{ once: true, amount: 0.3 }} // Animate only once, when 30% of the section is visible
    >
      {children}
    </motion.section>
  );
};

export default SectionContainer;