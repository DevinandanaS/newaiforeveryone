import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import RobotIcon from './RobotIcon';
import TrueFocus from './TrueFocus';
import './HomePage.css';

// Decrypted Text Component
const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view',
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const getNextIndex = revealedSet => {
      const textLength = text.length;
      switch (revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }

          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');

    const shuffleText = (originalText, currentRevealed) => {
      if (useOriginalCharsOnly) {
        const positions = originalText.split('').map((char, i) => ({
          char,
          isSpace: char === ' ',
          index: i,
          isRevealed: currentRevealed.has(i)
        }));

        const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);

        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }

        let charIndex = 0;
        return positions
          .map(p => {
            if (p.isSpace) return ' ';
            if (p.isRevealed) return originalText[p.index];
            return nonSpaceChars[charIndex++];
          })
          .join('');
      } else {
        return originalText
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (currentRevealed.has(i)) return originalText[i];
            return availableChars[Math.floor(Math.random() * availableChars.length)];
          })
          .join('');
      }
    };

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices(prevRevealed => {
          if (sequential) {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return prevRevealed;
            }
          } else {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(text);
            }
            return prevRevealed;
          }
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'both') return;

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsHovering(true);
          setHasAnimated(true);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animateOn, hasAnimated]);

  const hoverProps =
    animateOn === 'hover' || animateOn === 'both'
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false)
        }
      : {};

  return (
    <motion.span 
      className={parentClassName} 
      ref={containerRef} 
      style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }} 
      {...hoverProps} 
      {...props}
    >
      <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        {displayText}
      </span>

      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || !isScrambling || !isHovering;

          return (
            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
};

// Draggable Card Stack Component
const DraggableCardStack = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDragEnd = (event, info, index) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swiped right - go to previous card
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
      } else {
        // Swiped left - go to next card
        setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
      }
    }
  };

  return (
    <div className="card-stack-container">
      {cards.map((card, index) => {
        const isTop = index === currentIndex;
        const isNext = index === (currentIndex + 1) % cards.length;
        const isPrev = index === (currentIndex - 1 + cards.length) % cards.length;
        const stackIndex = cards.length - index;
        const zIndex = isTop ? cards.length : stackIndex;
        const offset = isTop ? 0 : isNext ? 10 : isPrev ? -10 : 20;
        const rotation = isTop ? 0 : isNext ? 5 : isPrev ? -5 : index % 2 === 0 ? 3 : -3;
        const scale = isTop ? 1 : 0.95 - (stackIndex - 1) * 0.05;
        const opacity = isTop ? 1 : 0.7 - (stackIndex - 1) * 0.1;

        return (
          <motion.div
            key={index}
            className="retro-card draggable"
            style={{
              zIndex,
              position: 'absolute',
            }}
            initial={false}
            animate={{
              x: offset,
              y: offset * 0.5,
              rotate: rotation,
              scale,
              opacity: Math.max(opacity, 0.3),
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: -300, right: 300 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => handleDragEnd(e, info, index)}
            whileDrag={{ 
              scale: 1.05,
              zIndex: 1000,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <div className="retro-icon">{card.icon}</div>
            <p>{card.text}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="home-page">
      <Navbar />
      <div className="hero-section">
        <div className="hero-content">
          <motion.div
            className="powered-by-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Powered by TinkerHub
          </motion.div>
          
          <motion.h1
            className="main-title"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AI FOR EVERYONE
          </motion.h1>
          
          <motion.h2
            className="subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Kerala's Open AI Movement
          </motion.h2>
          
          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            AI literacy for every Keralite — crafted with heart, head, and hand. 
            We're transforming Kerala's legacy of digital literacy into a future-ready 
            AI culture where communities understand, build, and govern AI locally and responsibly.
          </motion.p>
          
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              className="glass-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/about')}
            >
              Explore the Mission
            </motion.button>
            <motion.button
              className="glass-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/get-involved')}
            >
              Get Involved
            </motion.button>
          </motion.div>
        </div>
        
        <RobotIcon mousePosition={mousePosition} />
      </div>
      
      {/* Why Kerala Needs AI Literacy Section */}
      <section className="why-kerala-section">
        <div className="why-kerala-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '40px' }}
          >
            <h2 className="why-kerala-heading">
              <TrueFocus
                sentence="Why Kerala Needs AI Literacy Now?"
                separator=" "
                manualMode={true}
                blurAmount={5}
                borderColor="#000000"
                glowColor="rgba(0, 0, 0, 0.6)"
                animationDuration={0.5}
              />
            </h2>
          </motion.div>
          
          <motion.p
            className="why-kerala-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AI is already here — in our schools, workplaces, culture, and daily life. But not everyone understands it. Not everyone is safe from it. And not everyone has the chance to build with it.
          </motion.p>
          
          <div className="feature-cards">
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="feature-icon">🎯</div>
              <h3>Literacy for All & Global Model</h3>
              <p>Equitable AI education that empowers every citizen to understand and apply AI responsibly. Reaching at least one lakh learners across Kerala in the first phase.</p>
            </motion.div>
            
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="feature-icon">💡</div>
              <h3>Creators, Not Just Consumers</h3>
              <p>Enabling Keralites to innovate and build AI-driven solutions, not just use them.</p>
            </motion.div>
            
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="feature-icon">📄</div>
              <h3>Knowledge as a Public Good</h3>
              <p>Making AI knowledge accessible to all, with open, grassroots-first, multilingual approaches, where everyone becomes both learner and teacher.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* The Challenge Section */}
      <section className="challenge-section">
        <div className="challenge-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="challenge-heading">
              <DecryptedText 
                text="The Challenge"
                speed={50}
                maxIterations={10}
                sequential={true}
                revealDirection="start"
                animateOn="view"
                className="decrypted-char"
                encryptedClassName="encrypted-char"
                parentClassName="decrypted-text-wrapper"
              />
            </h2>
          </motion.div>
          
          <div className="challenge-cards-wrapper">
            <DraggableCardStack 
              cards={[
                {
                  icon: '🏫',
                  text: 'Many students are graduating without understanding the technologies that will define their future careers.'
                },
                {
                  icon: '💼',
                  text: "AI's rapid integration presents significant challenges for professionals as automation replaces traditional roles."
                },
                {
                  icon: '🛡️',
                  text: 'Deepfakes and misinformation blur truth. Elders face scams and fake news. AI literacy helps them pause, question, and protect themselves.'
                }
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
