import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span role="img" aria-hidden="true">
              ⚡
            </span>
            <span>AI for Everyone</span>
          </div>
          <p>Making AI literacy accessible to every Keralite—enabled by TinkerHub.</p>
          <p className="footer-note">Together we can set a global model for responsible AI adoption.</p>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Quick Links</h4>
          <button
            className="footer-link"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Home
          </button>
          <button className="footer-link" onClick={() => navigate('/about')}>
            About
          </button>
          <button className="footer-link" onClick={() => navigate('/get-involved')}>
            Get Involved
          </button>
          <button className="footer-link" onClick={() => navigate('/resources')}>
            Resources
          </button>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Connect</h4>
          <a className="footer-link" href="mailto:aiforeveryone@tinkerhub.org">
            aiforeveryone@tinkerhub.org
          </a>
          <a className="footer-link" href="https://tinkerhub.org" target="_blank" rel="noreferrer">
            tinkerhub.org
          </a>
          <a
            className="footer-link"
            href="https://instagram.com/tinkerhub"
            target="_blank"
            rel="noreferrer"
          >
            @TinkerHub
          </a>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} AI for Everyone. All rights reserved.</div>
    </footer>
  );
};

export default Footer;


