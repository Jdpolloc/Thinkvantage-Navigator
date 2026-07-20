import React from 'react';

export const TrackPointIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    aria-hidden="true"
    {...props}
  >
    <defs>
      {/* Dynamic 3D Spherical Radial Shading */}
      <radialGradient id="thinkRed3D" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ff7b7b" />
        <stop offset="25%" stopColor="#ef4444" />
        <stop offset="70%" stopColor="#b91c1c" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>

      {/* Tactile knobbly texture overlay */}
      <pattern id="bumpyTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.75" fill="#450a0a" opacity="0.85" />
        <circle cx="2" cy="2" r="0.4" fill="#ff8a8a" opacity="0.4" />
      </pattern>

      {/* Subtle bottom drop shadow */}
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.6" />
      </filter>
    </defs>

    {/* Outermost rubber rim */}
    <circle cx="16" cy="16" r="14.5" fill="#1e293b" stroke="#ef4444" strokeWidth="0.75" filter="url(#softShadow)" />
    
    {/* Metallic inner container ring */}
    <circle cx="16" cy="16" r="13" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />

    {/* Classic Red Rubber Dome Core with 3D gradient */}
    <circle cx="16" cy="16" r="12" fill="url(#thinkRed3D)" />

    {/* Tactile Knobs ("Cat Tongue" Texture) */}
    <circle cx="16" cy="16" r="12" fill="url(#bumpyTexture)" />

    {/* Shiny crescent light highlight */}
    <path
      d="M 8 12 Q 13 6 19 8 Q 13 9 8 12"
      fill="#ffffff"
      opacity="0.25"
      className="pointer-events-none"
    />
  </svg>
);

export const MouseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="5" y="2" width="14" height="20" rx="7" />
    <path d="M12 2v9" strokeWidth="1.5" />
    <path d="M5 11h14" strokeWidth="1.5" />
    {/* Glowing Scroll Wheel */}
    <rect x="11" y="5" width="2" height="4" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth="2" 
    stroke="currentColor" 
    aria-hidden="true"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ThinkVantageLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 310 34"
    aria-hidden="true"
    {...props}
  >
    <style>
      {`.logo-text-bold { font-family: 'Inter', system-ui, sans-serif; font-weight: 800; font-size: 26px; letter-spacing: -0.75px; fill: #ffffff; }
        .logo-text-red { font-family: 'Inter', system-ui, sans-serif; font-weight: 800; font-size: 26px; letter-spacing: -0.75px; fill: #ff4d4d; }`}
    </style>
    {/* White stem for lowercase 'i' */}
    <rect x="39.8" y="16" width="3.4" height="10.5" fill="#ffffff" rx="0.5" />
    
    {/* 3D-styled Red Dot over the 'i' */}
    <circle cx="41.5" cy="11" r="4.2" fill="#ff4d4d" />
    <circle cx="40" cy="9.5" r="1.5" fill="#ff9999" />
    
    <text x="0" y="26" className="logo-text-bold">Th</text>
    <text x="51" y="26" className="logo-text-bold">nkVantage</text>
    
    <text x="194" y="26">
      <tspan className="logo-text-bold">Navi</tspan>
      <tspan className="logo-text-red">gator</tspan>
    </text>
  </svg>
);

export const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    aria-hidden="true"
    {...props}
  >
    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);
