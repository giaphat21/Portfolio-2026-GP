import { motion, useScroll, useSpring } from 'motion/react';
import React from 'react';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#FF5722]"
    />
  );
};
