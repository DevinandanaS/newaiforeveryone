import React, { useState } from 'react';
import Lottie from 'lottie-react';
import secureLoginAnimation from '../animations/secureloginanimation.json';
import Navbar from './Navbar';
import Footer from './Footer';
import './ResourcesPage.css';

const ResourcesPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const mainCards = [
    {
      icon: '📄',
      title: 'Campaign PDF',
      description: 'Download our comprehensive campaign document outlining the vision, approach, and partnership opportunities.',
      buttonText: 'Download PDF',
      buttonLink: '#'
    },
    {
      icon: '🧠',
      title: 'Learning Materials',
      description: 'Access free AI learning resources for KuttyMakers, Young Makers, and Friends of the Movement in multiple languages.',
      buttonText: 'Browse Materials',
      buttonLink: '#'
    },
    {
      icon: '👥',
      title: 'Workshop Guides',
      description: 'Step-by-step guides for organizing and facilitating AI literacy workshops, study jams, and learning circles.',
      buttonText: 'View Guides',
      buttonLink: '#'
    },
    {
      icon: null,
      lottie: 'https://lottie.host/a0b7ec52-8c7e-4c59-b213-c4e8e2e1a5aa/ErwbAUAGdH.lottie',
      title: 'Safety & Ethics',
      description: 'Learn about AI safety, identifying deepfakes and misinformation, protecting privacy, and ethical AI use.',
      buttonText: 'Safety Guide',
      buttonLink: '#'
    }
  ];

  const toolsCards = [
    {
      icon: '✨',
      title: 'For KuttyMakers',
      description: 'Teachable Machine, Scratch, AI storybooks'
    },
    {
      icon: '🏗️',
      title: 'For Young Makers',
      description: 'Gen AI tools, LLMs, development platforms'
    },
    {
      icon: '❤️',
      title: 'For All',
      description: 'Learning circles, public demos, discussion forums'
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % mainCards.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + mainCards.length) % mainCards.length);
  };

  return (
    <div className="resources-page">
      <Navbar />
      
      <div className="resources-header">
        <h1 className="resources-title">Resources</h1>
        <p className="resources-subtitle">Learning materials, guides, and campaign information.</p>
      </div>
      
      <div className="circular-carousel-section">
        <div className="carousel-container">
          <button className="carousel-nav prev" onClick={prevSlide}>
            ←
          </button>
          
          <div className="circular-cards-wrapper">
            {mainCards.map((card, index) => {
              const position = (index - activeIndex + mainCards.length) % mainCards.length;
              return (
                <div
                  key={index}
                  className={`circular-card position-${position} ${position === 0 ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="circular-card-inner">
                    <span className="card-number">0{index + 1}</span>
                    {card.lottie ? (
                      <div className="card-lottie-wrapper">
                        <Lottie 
                          animationData={secureLoginAnimation} 
                          loop={true}
                          autoplay={true}
                        />
                      </div>
                    ) : (
                      <span className="card-icon-large">{card.icon}</span>
                    )}
                    <h2 className="card-title-large">{card.title}</h2>
                    <p className="card-description-large">{card.description}</p>
                    <a href={card.buttonLink} className="card-button-large">
                      {card.buttonText}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button className="carousel-nav next" onClick={nextSlide}>
            →
          </button>
        </div>
        
        <div className="carousel-dots">
          {mainCards.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="tools-platforms-section">
        <h2 className="section-heading">Tools & Platforms Mentioned</h2>
        <div className="tools-grid">
          {toolsCards.map((card, index) => (
            <div key={index} className="tool-card">
              <span className="tool-icon">{card.icon}</span>
              <h3 className="tool-title">{card.title}</h3>
              <p className="tool-desc">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResourcesPage;
