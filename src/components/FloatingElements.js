import React from 'react';
import { motion } from 'framer-motion';
import './FloatingElements.css';

const FloatingElements = () => {
  const colors = ['#FFD700', '#90EE90', '#FFB6C1', '#87CEEB']; // Yellow, Light Green, Pink, Blue
  
  const circles = Array.from({ length: 50 }, (_, i) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      id: i,
      size: Math.random() * 20 + 12, // Bigger circles: 12-32px
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      color: color,
      pulseDelay: Math.random() * 2,
    };
  });

  return (
    <div className="floating-elements-container">
      {circles.map((circle) => {
        return (
          <motion.div
            key={circle.id}
            className="floating-circle illuminated"
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              left: `${circle.x}%`,
              top: `${circle.y}%`,
              backgroundColor: circle.color,
              borderColor: circle.color,
              borderWidth: '2px',
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: circle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: circle.delay,
            }}
            whileHover={{
              scale: 1.5,
              boxShadow: `0 0 30px ${circle.color}, 0 0 60px ${circle.color}`,
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingElements;
