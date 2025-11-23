import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingPage.css';

const LoadingPage = () => {
  const [mainDisplayText, setMainDisplayText] = useState('');
  const [poweredByDisplayText, setPoweredByDisplayText] = useState('');
  const [showMainComplete, setShowMainComplete] = useState(false);
  const navigate = useNavigate();
  
  const mainText = 'AI FOR EVERYONE';
  const poweredByText = 'Powered by TinkerHub';
  
  useEffect(() => {
    let mainIndex = 0;
    const typingSpeed = 100; // milliseconds per character
    
    // Type main heading first
    const mainInterval = setInterval(() => {
      if (mainIndex < mainText.length) {
        setMainDisplayText(mainText.substring(0, mainIndex + 1));
        mainIndex++;
      } else {
        setShowMainComplete(true);
        clearInterval(mainInterval);
        
        // Wait a bit, then start typing powered by text
        setTimeout(() => {
          let poweredByIndex = 0;
          const poweredByInterval = setInterval(() => {
            if (poweredByIndex < poweredByText.length) {
              setPoweredByDisplayText(poweredByText.substring(0, poweredByIndex + 1));
              poweredByIndex++;
            } else {
              clearInterval(poweredByInterval);
              // Wait 1.5 seconds after full text is displayed, then redirect
              setTimeout(() => {
                navigate('/home');
              }, 1500);
            }
          }, typingSpeed);
        }, 500);
      }
    }, typingSpeed);
    
    return () => clearInterval(mainInterval);
  }, [navigate, mainText, poweredByText]);
  
  const isMainComplete = mainDisplayText.length >= mainText.length;
  const isPoweredByComplete = poweredByDisplayText.length >= poweredByText.length;
  
  return (
    <div className="loading-page">
      <div className="loading-container">
        <h1 className={`main-heading ${isMainComplete ? 'complete' : ''}`}>
          {mainDisplayText}
          {!isMainComplete && <span className="cursor">|</span>}
        </h1>
        {showMainComplete && (
          <h2 className="powered-by-heading">
            {poweredByDisplayText}
            {!isPoweredByComplete && <span className="cursor">|</span>}
          </h2>
        )}
      </div>
    </div>
  );
};

export default LoadingPage;

