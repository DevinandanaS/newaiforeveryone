import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CircularGallery from './CircularGallery';
import './ResourcesPage.css';

const ResourcesPage = () => {
  const items = [
    { 
      image: '/image/card_campaign.png', 
      text: 'Campaign PDF|Download our comprehensive campaign document' 
    },
    { 
      image: '/image/card_learning.png', 
      text: 'Learning Materials|Access free AI learning resources' 
    },
    { 
      image: '/image/card_workshop.png', 
      text: 'Workshop Guides|Step-by-step guides for organizing workshops' 
    },
    { 
      image: '/image/card_safety.png', 
      text: 'Safety & Ethics|Learn about AI safety and ethics' 
    },
    { 
      image: '/image/card_tools.png', 
      text: 'For KuttyMakers|Teachable Machine, Scratch, AI storybooks' 
    },
    { 
      image: '/image/card_tools.png', 
      text: 'For Young Makers|Gen AI tools, LLMs, development platforms' 
    },
    { 
      image: '/image/card_tools.png', 
      text: 'For All|Learning circles, public demos, forums' 
    }
  ];

  return (
    <div className="resources-page">
      <Navbar />
      <div className="resources-header">
        <h1 className="resources-title">Resources</h1>
        <p className="resources-subtitle">Learning materials, guides, and campaign information.</p>
      </div>
      
      <div className="gallery-container">
        <CircularGallery 
          items={items} 
          bend={2} 
          textColor="#ffffff" 
          borderRadius={0.05}
          font="bold 30px Figtree"
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default ResourcesPage;
