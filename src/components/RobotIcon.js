import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import './RobotIcon.css';

// Lottie asset reference for chatbot animation
// Animation: https://lottiefiles.com/free-animation/chatbot-9e242FbdlM
// Download the JSON file from LottieFiles and place it in public/animations/chatbot.json
const CHATBOT_ANIMATION_URLS = [
  '/animations/chatbot.json' // Local file - REQUIRED: Download from LottieFiles
];

const RobotIcon = ({ mousePosition }) => {
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [chatbotLottieData, setChatbotLottieData] = useState(null);

  // Load Lottie animation data for chatbot
  useEffect(() => {
    let isMounted = true;

    const fetchAnimation = async (url) => {
      // For local files, use 'same-origin' mode; for external URLs, use 'cors'
      const isLocalFile = url.startsWith('/');
      const response = await fetch(url, { 
        cache: 'no-store',
        mode: isLocalFile ? 'same-origin' : 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      // Validate it's a Lottie JSON
      if (!data || !data.v) {
        throw new Error('Invalid Lottie JSON format');
      }
      return data;
    };

    const loadChatbotAnimation = async () => {
      console.log('Loading Chatbot animation...');
      for (const url of CHATBOT_ANIMATION_URLS) {
        try {
          console.log(`Trying URL: ${url}`);
          const data = await fetchAnimation(url);
          if (isMounted) {
            console.log('Chatbot animation loaded successfully!');
            setChatbotLottieData(data);
            return; // Success, exit the loop
          }
        } catch (error) {
          console.warn(`Chatbot animation failed from ${url}:`, error.message);
          continue; // Try next URL
        }
      }
      console.error('All Chatbot animation URLs failed to load. Check browser console for details.');
    };

    loadChatbotAnimation();
    return () => {
      isMounted = false;
    };
  }, []);

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
        {chatbotLottieData ? (
          <motion.div
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
            style={{ width: '500px', height: '500px' }}
          >
            <Lottie 
              animationData={chatbotLottieData}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>
        ) : (
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
        )}
      </motion.div>
    </motion.div>
  );
};

export default RobotIcon;
