import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
  threshold = 0.1,
  className = '',
  ...props
}: ScrollRevealProps) {
  
  const getDirections = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'scale':
        return { scale: 0.94, opacity: 0 };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };

  const getTarget = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 };
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 };
      case 'scale':
        return { scale: 1, opacity: 1 };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getDirections()}
      whileInView={getTarget()}
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom authentic ease-out expo curve for ultra premium cinematic momentum
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
