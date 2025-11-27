import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import ScrollReveal from './ScrollReveal';
import Footer from './Footer';
import './AboutPage.css';

const principles = [
  {
    title: 'Equitable Education',
    description: 'Every citizen empowered to understand and apply AI responsibly.'
  },
  {
    title: 'Community-Centered',
    description: 'Every individual becomes both a learner and a teacher.'
  },
  {
    title: 'Creator Mindset',
    description: 'Not just using AI, but innovating and building with it.'
  }
];

const infoSections = [
  {
    id: 'quick-take',
    icon: '⚡',
    title: 'Quick Take',
    paragraphs: [
      'The "AI for Everyone" initiative, enabled by TinkerHub, is a statewide program aiming to democratize AI knowledge across Kerala.',
      'Building on Kerala’s digital literacy legacy, it turns communities into active creators in the AI era, addressing skill gaps, workforce changes, and misinformation.'
    ]
  },
  {
    id: 'vision',
    icon: '✨',
    title: 'Our Vision',
    paragraphs: [
      '"We have a historical opportunity and responsibility to establish a human-centred framework for AI research, education, practice and policy."'
    ],
    author: '— Fei-Fei Li, Stanford University & Co-Founder of AI4ALL'
  },
  {
    id: 'history',
    icon: '📜',
    title: 'The Historical Context',
    paragraphs: [
      'Kerala once led the world in digital literacy. We showed what’s possible when a state commits to empowering every citizen with technology.',
      'This initiative aims to reach at least one lakh learners across Kerala in the first phase, making AI knowledge a public good accessible to all through open, grassroots-first, multilingual approaches.'
    ]
  }
];

const AboutPage = () => {
  const scrollContainerRef = useRef(null);

  return (
    <div className="about-page" ref={scrollContainerRef}>
      <Navbar />
      <div className="about-noise" />

      <main className="about-shell">
        <section className="about-hero">
          <div className="about-hero-top">
            <span className="hero-pill">Kerala 2030 Storyline</span>
            <Link to="/home" className="about-back-link">
              ← Back to Home
            </Link>
          </div>
          <div className="heading-lockup">
            <span className="heading-icon" aria-hidden="true">
              🚀
            </span>
            <ScrollReveal
              as="h1"
              scrollContainerRef={scrollContainerRef}
              containerClassName="about-hero-heading"
              textClassName="heading-gradient-text"
              baseRotation={1}
              baseOpacity={0.95}
              rotationEnd="top center"
            >
              About the Mission
            </ScrollReveal>
          </div>
          <ScrollReveal
            as="p"
            scrollContainerRef={scrollContainerRef}
            containerClassName="about-hero-subtitle"
            baseRotation={0.5}
            baseOpacity={0.9}
            rotationEnd="top center"
          >
            We are building Kerala&apos;s next leap in digital literacy—one that turns every resident
            into an AI-native creator through shared knowledge, open collaboration, and inclusive
            tools.
          </ScrollReveal>
          <div className="hero-tags">
            {['Grassroots-first', 'Open Source Energy', 'People + AI'].map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>

        <section className="info-stack">
          {infoSections.map(section => (
            <article key={section.id} className="info-card">
              <div className="heading-lockup info-card-heading">
                <span className="heading-icon" aria-hidden="true">
                  {section.icon}
                </span>
                <ScrollReveal
                  as="h3"
                  scrollContainerRef={scrollContainerRef}
                  containerClassName="info-card-title"
                  textClassName="heading-gradient-text"
                  baseRotation={0.8}
                  baseOpacity={0.95}
                >
                  {section.title}
                </ScrollReveal>
              </div>
              {section.paragraphs.map((copy, index) => (
                <ScrollReveal
                  key={`${section.id}-${index}`}
                  as="p"
                  scrollContainerRef={scrollContainerRef}
                  containerClassName={`info-card-paragraph ${
                    section.author && index === section.paragraphs.length - 1 ? 'is-quote' : ''
                  }`}
                  baseRotation={0.4}
                  baseOpacity={0.85}
                >
                  {copy}
                </ScrollReveal>
              ))}
              {section.author && <p className="info-card-author">{section.author}</p>}
            </article>
          ))}
        </section>

        <section className="principle-panel">
          <div className="heading-lockup principle-heading-lockup">
            <span className="heading-icon" aria-hidden="true">
              🧭
            </span>
            <ScrollReveal
              as="h3"
              scrollContainerRef={scrollContainerRef}
              containerClassName="principle-heading"
              textClassName="heading-gradient-text"
              baseOpacity={0.95}
            >
              Our Core Principles
            </ScrollReveal>
          </div>
          <div className="principle-card-list">
            {principles.map(principle => (
              <article key={principle.title} className="principle-card">
                <ScrollReveal
                  as="h4"
                  scrollContainerRef={scrollContainerRef}
                  containerClassName="principle-title"
                  baseRotation={0.5}
                  baseOpacity={0.9}
                >
                  {principle.title}
                </ScrollReveal>
                <ScrollReveal
                  as="p"
                  scrollContainerRef={scrollContainerRef}
                  containerClassName="principle-copy"
                  baseRotation={0.3}
                  baseOpacity={0.85}
                >
                  {principle.description}
                </ScrollReveal>
              </article>
            ))}
          </div>
        </section>

        <section className="info-card info-card--enabled">
          <div className="heading-lockup info-card-heading">
            <span className="heading-icon" aria-hidden="true">
              🤝
            </span>
            <ScrollReveal
              as="h3"
              scrollContainerRef={scrollContainerRef}
              containerClassName="info-card-title"
              textClassName="heading-gradient-text"
              baseRotation={0.6}
              baseOpacity={0.95}
            >
              Enabled by TinkerHub
            </ScrollReveal>
          </div>
          <ScrollReveal
            as="p"
            scrollContainerRef={scrollContainerRef}
            containerClassName="info-card-paragraph"
            baseRotation={0.3}
            baseOpacity={0.85}
          >
            TinkerHub acts as the enabler and host of this campaign, holding space for partners and
            communities to lead, learn, and build together. This collaborative approach keeps the
            initiative grassroots-driven while maintaining quality and scale.
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;

