import React from 'react';
import './InflatedText.css';

const InflatedText = ({ children, className = '' }) => {
  return (
    <h1 className={`inflated-text ${className}`}>
      {children}
    </h1>
  );
};

export default InflatedText;
