import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import Navbar from './Navbar';
import RobotIcon from './RobotIcon';
import TrueFocus from './TrueFocus';
import RotatingText from './RotatingText';
import LogoLoop from './LogoLoop';
import GradientText from './GradientText';
import Footer from './Footer';
import './HomePage.css';

// Lottie asset references for the Young Makers community card
const YOUNG_MAKER_ANIMATION_URLS = {
  primary: 'https://assets-v2.lottiefiles.com/a/2de40d56-1170-11ee-b6d7-c716ecc89740/3o5wO8jIqU.json',
  fallback: 'https://assets-v2.lottiefiles.com/a/2de40d56-1170-11ee-b6d7-c716ecc89740/KYIKFUWMLi.json',
};

// Lottie asset references for KuttyMakers icon (thinking animation)
// Animation: https://lottiefiles.com/free-animation/thinking-O8a7dvcMvR
// Download the JSON file from LottieFiles and place it in public/animations/kuttymakers.json
const KUTTYMAKERS_ANIMATION_URLS = [
  '/animations/kuttymakers.json' // Local file - REQUIRED: Download from LottieFiles
];

// Lottie asset references for Friends of the Movement card (man and robot animation)
// Animation: https://lottiefiles.com/free-animation/man-and-robot-with-computers-sitting-together-in-workplace-QnbODCGAFt
// Download the JSON file from LottieFiles and place it in public/animations/friends.json
const FRIENDS_ANIMATION_URLS = [
  '/animations/friends.json' // Local file - REQUIRED: Download from LottieFiles
];

// Lottie asset references for chatbot animation (home section)
const CHATBOT_ANIMATION_URLS = [
  'https://lottie.host/9e242FbdlM.json',
  'https://assets5.lottiefiles.com/packages/lf20_9e242FbdlM.json',
  'https://assets-v2.lottiefiles.com/animation/9e242FbdlM.json'
];

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
            <div className="retro-icon">
              {card.iconType === 'image' ? (
                <img 
                  src={card.icon} 
                  alt={card.iconAlt || 'Challenge icon'} 
                  className="animated-icon-image"
                />
              ) : (
                card.icon
              )}
            </div>
            <p>{card.text}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

// Typewriter Component
const TypewriterText = ({ text, speed = 100, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
};

// Community Carousel Component
const CommunityCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);
  const [lottieData, setLottieData] = useState(null);
  const [kuttymakersLottieData, setKuttymakersLottieData] = useState(null);
  const [friendsLottieData, setFriendsLottieData] = useState(null);

  // Load Lottie animation data for the Young Makers card
  useEffect(() => {
    let isMounted = true;

    const fetchAnimation = async (url) => {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    };

    const loadAnimation = async () => {
      try {
        const primaryData = await fetchAnimation(YOUNG_MAKER_ANIMATION_URLS.primary);
        if (isMounted) {
          setLottieData(primaryData);
        }
      } catch (primaryError) {
        console.warn('Primary Young Makers animation failed, trying fallback.', primaryError);
        try {
          const fallbackData = await fetchAnimation(YOUNG_MAKER_ANIMATION_URLS.fallback);
          if (isMounted) {
            setLottieData(fallbackData);
          }
        } catch (fallbackError) {
          console.error('Young Makers animation failed to load.', {
            primaryError,
            fallbackError,
          });
        }
      }
    };

    loadAnimation();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load Lottie animation data for KuttyMakers icon
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

    const loadKuttymakersAnimation = async () => {
      console.log('Loading KuttyMakers animation...');
      for (const url of KUTTYMAKERS_ANIMATION_URLS) {
        try {
          console.log(`Trying URL: ${url}`);
          const data = await fetchAnimation(url);
          if (isMounted) {
            console.log('KuttyMakers animation loaded successfully!');
            setKuttymakersLottieData(data);
            return; // Success, exit the loop
          }
        } catch (error) {
          console.warn(`KuttyMakers animation failed from ${url}:`, error.message);
          continue; // Try next URL
        }
      }
      console.error('All KuttyMakers animation URLs failed to load. Check browser console for details.');
    };

    loadKuttymakersAnimation();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load Lottie animation data for Friends of the Movement card
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

    const loadFriendsAnimation = async () => {
      console.log('Loading Friends animation...');
      for (const url of FRIENDS_ANIMATION_URLS) {
        try {
          console.log(`Trying URL: ${url}`);
          const data = await fetchAnimation(url);
          if (isMounted) {
            console.log('Friends animation loaded successfully!');
            setFriendsLottieData(data);
            return; // Success, exit the loop
          }
        } catch (error) {
          console.warn(`Friends animation failed from ${url}:`, error.message);
          continue; // Try next URL
        }
      }
      console.error('All Friends of the Movement animation URLs failed to load. Check browser console for details.');
    };

    loadFriendsAnimation();
    return () => {
      isMounted = false;
    };
  }, []);

  const communities = [
    {
      id: 'kuttymakers',
      subtitle: 'Ages 10-17',
      title: 'KuttyMakers',
      icon: '⭐',
      description: 'Children are already talking to AI every day. Let\'s help them create with it.',
      activities: ['Pattern games', 'Sorting experiments', 'AI storybooks', 'Teachable Machine'],
      image: '/images/kuttymakers.gif' // Placeholder - you can provide the actual image
    },
    {
      id: 'youngmakers',
      subtitle: 'College & Early Professionals',
      title: 'Young Makers',
      icon: '🏗️',
      description: 'Kerala\'s young talent can become AI innovators, not just job seekers.',
      activities: ['GenAI study jams', 'Hackathons', 'Open datasets', 'Mentorship circles'],
      image: '/images/youngmakers.gif' // Placeholder - you can provide the actual image
    },
    {
      id: 'friends',
      subtitle: 'Parents • Educators • Elders',
      title: 'Friends of the Movement',
      icon: '❤️',
      description: 'AI literacy keeps communities safe, informed, and future-ready.',
      activities: ['Misinformation watch', 'Community forums', 'Learning circles', 'Safety playbooks'],
      image: '/images/friends.gif' // Placeholder - you can provide the actual image
    }
  ];

  const nextCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % communities.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + communities.length) % communities.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextCard();
    }
    if (isRightSwipe) {
      prevCard();
    }
  };

  // Mouse drag support
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragCurrent, setDragCurrent] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragCurrent(e.clientX);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    setDragCurrent(e.clientX);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    const distance = dragStart - dragCurrent;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextCard();
    }
    if (isRightSwipe) {
      prevCard();
    }
    setIsDragging(false);
  };

  return (
    <div className="community-carousel-container">
      <div className="carousel-wrapper">
        <button className="carousel-nav-btn prev" onClick={prevCard} aria-label="Previous card">
          ‹
        </button>
        
        <div 
          className="carousel-track"
          ref={carouselRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {communities.map((community, index) => {
            const position = index - currentIndex;
            const isActive = position === 0;
            const isNext = position === 1;
            const isPrev = position === -1;
            
            return (
              <motion.div
                key={community.id}
                className={`community-card ${isActive ? 'active' : ''} ${isNext ? 'next' : ''} ${isPrev ? 'prev' : ''}`}
                initial={false}
                animate={{
                  x: position * 50,
                  scale: isActive ? 1 : 0.85,
                  opacity: isActive ? 1 : isNext || isPrev ? 0.6 : 0.3,
                  zIndex: isActive ? 10 : isNext || isPrev ? 5 : 1
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <div className="community-card-image">
                  {community.id === 'youngmakers' && lottieData ? (
                    <Lottie 
                      animationData={lottieData}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : community.id === 'kuttymakers' && kuttymakersLottieData ? (
                    <Lottie 
                      animationData={kuttymakersLottieData}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : community.id === 'friends' && friendsLottieData ? (
                    <Lottie 
                      animationData={friendsLottieData}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <>
                      <img 
                        src={community.image} 
                        alt={community.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="community-card-icon-fallback" style={{ display: 'none' }}>
                        {community.icon}
                      </div>
                    </>
                  )}
                </div>
                <div className="community-card-content">
                  <p className="community-card-subtitle">{community.subtitle}</p>
                  <h3 className="community-card-title">{community.title}</h3>
                  <p className="community-card-description">{community.description}</p>
                  <div className="community-activities">
                    {community.activities.map((activity, idx) => (
                      <motion.button
                        key={idx}
                        className="activity-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="activity-icon">⭐</span>
                        {activity}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <button className="carousel-nav-btn next" onClick={nextCard} aria-label="Next card">
          ›
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const partnerCategories = [
    {
      title: 'Knowledge Partners',
      icon: '🧠',
      points: [
        'Tech companies & AI experts',
        'Educators & content creators',
        'Curriculum designers'
      ]
    },
    {
      title: 'Financial Partners',
      icon: '💠',
      points: [
        'Program funding & operations',
        'Resource & material support',
        'Scaling to new districts'
      ]
    },
    {
      title: 'Media & Outreach',
      icon: '🌐',
      points: [
        'Traditional & digital media',
        'Content creators & influencers',
        'Local language content'
      ]
    },
    {
      title: 'Resource Partners',
      icon: '🛡️',
      points: [
        'Hardware & software access',
        'Learning materials & books',
        'Technical support'
      ]
    },
    {
      title: 'Community Partners',
      icon: '🤝',
      points: [
        'Schools, libraries, NGOs',
        'Kudumbashree & workplaces',
        'Individual volunteer hosts'
      ]
    }
  ];

  const partnerActions = [
    'Host learning programs & workshops',
    'Sponsor toolkits & programs',
    'Open doors for communities',
    'Volunteer & mentor learners',
    'Contribute real-world challenges',
    'Provide financial support'
  ];

  const handleVolunteerClick = () => {
    window.location.href = 'mailto:aiforeveryone@tinkerhub.org';
  };

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
                  // To use an animated icon (GIF/SVG), uncomment and modify:
                  // iconType: 'image',
                  // icon: '/path/to/your/animated-icon-1.gif',
                  // iconAlt: 'School icon',
                  text: 'Many students are graduating without understanding the technologies that will define their future careers.'
                },
                {
                  icon: '💼',
                  // To use an animated icon (GIF/SVG), uncomment and modify:
                  // iconType: 'image',
                  // icon: '/path/to/your/animated-icon-2.gif',
                  // iconAlt: 'Briefcase icon',
                  text: "AI's rapid integration presents significant challenges for professionals as automation replaces traditional roles."
                },
                {
                  icon: '🛡️',
                  // To use an animated icon (GIF/SVG), uncomment and modify:
                  // iconType: 'image',
                  // icon: '/path/to/your/animated-icon-3.gif',
                  // iconAlt: 'Shield icon',
                  text: 'Deepfakes and misinformation blur truth. Elders face scams and fake news. AI literacy helps them pause, question, and protect themselves.'
                }
              ]}
            />
          </div>
        </div>
      </section>
      
      {/* Our Approach Section */}
      <section className="our-approach-section">
        <div className="our-approach-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="our-approach-heading">
              <DecryptedText 
                text="Our Approach"
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
            <motion.p
              className="our-approach-tagline"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              True learning engages the head, hand, and heart.
            </motion.p>
          </motion.div>
          
          <div className="bounce-cards-container">
            <motion.div
              className="bounce-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className="bounce-card-icon">🧠</div>
              <h3 className="bounce-card-title">Head</h3>
              <p className="bounce-card-subtitle">Understand</p>
              <p className="bounce-card-description">Decode how AI works and why it matters in daily life.</p>
            </motion.div>
            
            <motion.div
              className="bounce-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className="bounce-card-icon">✋</div>
              <h3 className="bounce-card-title">Hand</h3>
              <p className="bounce-card-subtitle">Build</p>
              <p className="bounce-card-description">Create projects, datasets, and prototypes rooted in Kerala.</p>
            </motion.div>
            
            <motion.div
              className="bounce-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className="bounce-card-icon">❤️</div>
              <h3 className="bounce-card-title">Heart</h3>
              <p className="bounce-card-subtitle">Create</p>
              <p className="bounce-card-description">Mentor others and shape a safer, more inclusive AI future.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Who Is This For Section */}
      <section className="who-is-this-for-section">
        <div className="who-is-this-for-container">
          <motion.div
            className="who-is-this-for-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="who-is-this-for-heading">
              <TypewriterText 
                text="WHO IS THIS FOR?"
                speed={80}
                className="typewriter-text"
              />
            </h2>
          </motion.div>
          
          <CommunityCarousel />
        </div>
      </section>

      {/* Partner With Us Section */}
      <section className="partner-section">
        <div className="partner-container">
          <motion.p
            className="partner-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Partners make Kerala&apos;s AI movement real
          </motion.p>

          <motion.h2
            className="partner-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Partner With Us
          </motion.h2>

          <motion.p
            className="partner-quote"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            “You can help us bring AI literacy to every corner of Kerala. One workshop,
            one sponsor, one volunteer can change a life.”
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GradientText className="partner-description" animationSpeed={12}>
              TinkerHub acts as the enabler of this campaign, holding space for partners and
              communities to lead, learn, and build together. Choose a role that fits your expertise
              and help us scale AI literacy statewide.
            </GradientText>
          </motion.div>

          <div className="partner-cards-loop">
            <LogoLoop
              logos={partnerCategories}
              gap={120}
              speed={70}
              pauseOnHover
              ariaLabel="Partner categories"
              renderItem={(category, key) => (
                <div
                  className={`partner-card ${
                    category.title === 'Community Partners' ? 'partner-card--extra-gap' : ''
                  }`}
                  key={key}
                >
                  <div className="partner-card-icon" aria-hidden="true">
                    {category.icon}
                  </div>
                  <h3 className="partner-card-title">{category.title}</h3>
                  <ul className="partner-card-points">
                    {category.points.map((point) => (
                      <li key={point} className="partner-card-point">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            />
          </div>

          <motion.div
            className="partner-actions"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="partner-actions-header">
            <div className="partner-rotating-text" aria-hidden="true">
              <RotatingText
                texts={[
                  'How You Can Partner With Us?',
                  'Support Kerala’s AI Movement',
                  'Build With TinkerHub Communities'
                ]}
                splitBy="words"
                staggerDuration={0.05}
                mainClassName="partner-rotating-display"
                splitLevelClassName="partner-rotating-word"
                elementLevelClassName="partner-rotating-element"
              />
            </div>
              <div className="partner-actions-copy">
                <h3>How You Can Partner</h3>
                <p>
                  Pick one action or mix a few—every contribution unlocks AI literacy for another
                  community.
                </p>
              </div>
            </div>

            <div className="partner-actions-list">
              {partnerActions.map((action) => (
                <div key={action} className="partner-action">
                  <span className="partner-check" aria-hidden="true">
                    ✓
                  </span>
                  {action}
                </div>
              ))}
            </div>

            <div className="partner-cta-buttons">
              <button
                className="partner-cta-button primary"
                onClick={() => navigate('/get-involved')}
              >
                Become a Host
              </button>
              <button
                className="partner-cta-button"
                onClick={() => navigate('/get-involved')}
              >
                Host a Program
              </button>
              <button
                className="partner-cta-button"
                onClick={() => navigate('/get-involved')}
              >
                Volunteer
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="quote-container">
          <div className="quote-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <blockquote className="quote-text">
            "AI will shape the future of work, culture, and communities. Kerala can either be a consumer or a creator. With your partnership, we can ensure every Keralite learns, builds, and creates responsibly with AI. This is our chance to set a global model again, like we did with digital literacy."
          </blockquote>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
