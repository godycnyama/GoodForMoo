import React from 'react';
import { motion } from 'framer-motion';
import { useStyles } from '../Nav';

const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100vw",
      scale: 0.8
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: "100vw",
      scale: 1.2
    }
  };
  
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };
  
  const pageStyle = {
    position: "absolute"
  };

const Transition = ({ children }) => {
    const classes = useStyles();
    return (
        <motion.div
            style={null}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
          {children}
        </motion.div>
    )
}

export default Transition;