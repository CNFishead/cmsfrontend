'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { exit } from 'process';

type AnimatedDivProps = {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  type?: 'whileInView' | 'whileHover' | 'whileDrag' | 'whileFocus' | 'whileTap';
  transitionType?: 'fade' | 'jump' | 'slide' | 'scale' | 'slideReverse';
  random?: boolean;
};

const AnimatedDiv = ({
  children,
  className,
  duration,
  type,
  transitionType,
  random,
}: AnimatedDivProps) => {
  const variants = {
    fade: {
      visible: { opacity: 1 },
      hidden: { opacity: 0 },
      transition: { duration: duration ?? 1 },
      exit: { opacity: 0 },
    },
    jump: {
      visible: { y: 0 },
      hidden: { y: 500 },
      transition: { duration: duration ?? 1 },
    },
    slide: {
      visible: { x: 0 },
      hidden: { x: 500 },
      transition: { duration: duration ?? 1 },
    },
    slideReverse: {
      visible: { x: 0 },
      hidden: { x: -500 },
      transition: { duration: duration ?? 1 },
    },
    scale: {
      hidden: { scale: 0 },
      visible: { scale: 1 },
    },
  } as any;

  const randomVariant = () => {
    const variants = ['fade', 'jump', 'slide', 'scale'];
    return variants[Math.floor(Math.random() * variants.length)] as any;
  };
  // we want to set a selected variant based on the transitionType, but also on
  // random if it's true, if it's true we want to select a random variant
  // we also want to select a random variant if the transitionType is not valid or missing
  const selectedVariant = transitionType
    ? variants[transitionType]
    : variants[randomVariant()];

  return (
    <motion.div
      // initial has to find the variant we want and use dot notation to access the hidden property
      initial={'hidden'}
      whileInView={type === 'whileInView' ? 'visible' : undefined}
      whileHover={type === 'whileHover' ? 'visible' : undefined}
      whileDrag={type === 'whileDrag' ? 'visible' : undefined}
      whileFocus={type === 'whileFocus' ? 'visible' : undefined}
      whileTap={type === 'whileTap' ? 'visible' : undefined}
      viewport={{ once: false }}
      transition={{ duration: duration ?? 1 }}
      variants={selectedVariant}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedDiv;
