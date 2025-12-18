
import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = "", size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="white" stroke="#e7e5e4" strokeWidth="1" />
      
      {/* House Silhouette / Book Pages */}
      <path 
        d="M30 75V45L50 25L70 45V75H30Z" 
        stroke="#292524" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Book Lines in the "House" */}
      <line x1="38" y1="55" x2="62" y2="55" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="62" x2="62" y2="62" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="69" x2="50" y2="69" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default BrandLogo;
