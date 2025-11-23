import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './RobotIcon.css';

const RobotIcon = ({ mousePosition }) => {
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const updateRobotPosition = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const deltaX = (mousePosition.x - centerX) / 25;
      const deltaY = (mousePosition.y - centerY) / 25;
      
      setRobotPosition({ x: deltaX, y: deltaY });
      setIsMoving(Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3);
    };

    updateRobotPosition();
  }, [mousePosition]);

  return (
    <motion.div
      className="robot-container"
      animate={{
        x: robotPosition.x,
        y: robotPosition.y,
        rotate: robotPosition.x * 0.05,
      }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 15,
      }}
    >
      {/* Speech Bubble */}
      <motion.div
        className="speech-bubble"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <span>Let's learn AI together! ⭐</span>
      </motion.div>
      
      <motion.div
        className="robot-image-wrapper"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.img
          src={process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/image/roboimage.jpg` : '/image/roboimage.jpg'}
          alt="AI Robot"
          className="robot-image"
          onError={(e) => {
            console.error('Image failed to load. Trying alternative path...');
            e.target.src = '/image/roboimage.jpg';
          }}
          animate={isMoving ? {
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          } : {
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default RobotIcon;
