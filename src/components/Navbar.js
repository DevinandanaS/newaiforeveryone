import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/home', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/get-involved', label: 'Get Involved' },
    { path: '/resources', label: 'Resources' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Circular Text Logo */}
        <motion.div
          className="circular-logo"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 100 100" className="circular-svg">
            <defs>
              <path
                id="circle"
                d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
              />
            </defs>
            <text className="circular-text">
              <textPath href="#circle" startOffset="0%">
                AI FOR EVERYONE • AI FOR EVERYONE • AI FOR EVERYONE •
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* Bubble Menu - Always Visible */}
        <div className="bubble-menu">
          {menuItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`bubble-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
