import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './GetInvolvedPage.css';

const GetInvolvedPage = () => {
  const mainCards = [
    {
      id: 'knowledge',
      title: 'Become a Knowledge Partner',
      icon: '🧠',
      description: 'Share your expertise in AI, education, or content creation.',
      bullets: [
        'Tech companies & AI experts providing technical know-how',
        'Educators designing curriculum and leading workshops',
        'Subject experts connecting AI to specific fields'
      ],
      buttonText: 'Partner With Us',
      color: '#32CD32'
    },
    {
      id: 'volunteer',
      title: 'Volunteer & Mentor',
      icon: '👥',
      description: 'Join our network of volunteers helping communities learn AI.',
      bullets: [
        'Facilitate workshops and study circles',
        'Guide learners and mentor grassroots facilitators',
        'Organize neighborhood learning circles'
      ],
      buttonText: 'Join as Volunteer',
      color: '#9370DB'
    },
    {
      id: 'host',
      title: 'Host a Program',
      icon: '🛡️',
      description: 'Schools, colleges, libraries, and community centers can host AI literacy programs.',
      bullets: [
        'Provide venues and gather communities',
        'Facilitate workshops and demo days',
        'Open doors for children, youth, and elders'
      ],
      buttonText: 'Become a Host',
      color: '#FF6B35'
    },
    {
      id: 'financial',
      title: 'Financial Support',
      icon: '✨',
      description: 'Help us scale and sustain this initiative across Kerala.',
      bullets: [
        'Sponsor facilitator training and venue costs',
        'Fund learning materials and toolkits',
        'Support scaling to new districts'
      ],
      buttonText: 'Contribute',
      color: '#9370DB'
    }
  ];

  const moreWays = [
    {
      id: 'media',
      icon: '🌐',
      title: 'Media Partner',
      description: 'Amplify our message through traditional and digital media.'
    },
    {
      id: 'resource',
      icon: '📱',
      title: 'Resource Provider',
      description: 'Contribute hardware, software, or learning materials.'
    },
    {
      id: 'challenge',
      icon: '💡',
      title: 'Challenge Creator',
      description: 'Add real-world problems for learners to solve.'
    }
  ];

  return (
    <div className="get-involved-page">
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero-section-wrapper">
        <Link to="/home" className="get-involved-back-link">
          ← Back to Home
        </Link>
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="page-title">
              <span className="title-text">Get Involved</span>
              <span className="page-subtitle">Join us in bringing AI literacy to every corner of Kerala.</span>
            </h1>
          </div>
          <div className="hero-image">
            <img src="/image/54950.jpg" alt="AI and Community Learning" />
          </div>
        </div>
      </div>

      {/* Main Cards Section */}
      <div className="cards-section">
        <div className="cards-grid">
          {mainCards.map((card, index) => (
            <div key={card.id} className={`involvement-card card-${index + 1}`}>
              <div className="involvement-card-inner" style={{ borderColor: card.color }}>
                <span className="card-icon">{card.icon}</span>
                <h2>{card.title}</h2>
                <p className="card-description">{card.description}</p>
                <ul className="card-bullets">
                  {card.bullets.map((bullet, i) => (
                    <li key={i}>• {bullet}</li>
                  ))}
                </ul>
                <a href="#contact" className="card-button" style={{ backgroundColor: card.color }}>
                  {card.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More Ways Section */}
      <div className="more-ways-section">
        <h2 className="section-title">More Ways to Get Involved</h2>
        <div className="more-ways-grid">
          {moreWays.map(way => (
            <div key={way.id} className="more-way-card">
              <span className="more-way-icon">{way.icon}</span>
              <h3>{way.title}</h3>
              <p>{way.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section" id="contact">
        <h2 className="section-title">Contact Us</h2>
        <p className="contact-intro">Ready to partner? Have questions? Reach out to us:</p>
        <div className="contact-details">
          <div className="contact-item">
            <span className="contact-label">Email:</span>
            <a href="mailto:aiforeveryone@tinkerhub.org" className="contact-link">
              aiforeveryone@tinkerhub.org
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-label">Website:</span>
            <a href="https://tinkerhub.org" target="_blank" rel="noopener noreferrer" className="contact-link">
              tinkerhub.org
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-label">Social:</span>
            <a href="https://twitter.com/TinkerHub" target="_blank" rel="noopener noreferrer" className="contact-link">
              @TinkerHub
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GetInvolvedPage;
