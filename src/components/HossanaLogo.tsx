import React from 'react';

interface HossanaLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  variant?: 'light' | 'dark' | 'brand';
  className?: string;
}

export default function HossanaLogo({ size = 48, variant = 'brand', className, ...props }: HossanaLogoProps) {
  const getColors = () => {
    switch (variant) {
      case 'light':
        return {
          bg: 'transparent',
          border: 'rgba(255, 255, 255, 0.85)',
          primary: '#ffffff',
          secondary: '#ffd700', // Gold
          accent: '#ffffff',
        };
      case 'dark':
        return {
          bg: 'transparent',
          border: 'rgba(15, 23, 42, 0.1)',
          primary: '#0f172a', // deep slate
          secondary: '#ffd700', // Gold
          accent: '#b45309', // amber/gold
        };
      case 'brand':
      default:
        return {
          bg: 'url(#brandGrad)',
          border: 'url(#goldGrad)',
          primary: '#ffd700', 
          secondary: '#ffffff',
          accent: '#ffd700',
        };
    }
  };

  const colors = getColors();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        {/* Deep rich premium gradient for the luxury badge background */}
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b18" /> {/* High-end luxurious dark chocolate background for premium contrast */}
          <stop offset="100%" stopColor="#0a0908" />
        </linearGradient>

        {/* Master artisan polished luxury gold gradient */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffeebe" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#aa7c11" />
        </linearGradient>
        
        {/* Subtle drop shadow */}
        <filter id="royalShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.55" floodColor="#000000" />
        </filter>
      </defs>

      {/* 1. Medallion Accent Frame */}
      {variant === 'brand' ? (
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          fill="url(#brandGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="4.5"
          filter="url(#royalShadow)"
        />
      ) : variant === 'dark' ? (
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          fill="transparent"
          stroke={colors.primary}
          strokeWidth="3.5"
        />
      ) : (
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          fill="transparent"
          stroke={colors.border}
          strokeWidth="3"
        />
      )}

      {/* 2. Embedded Symmetrical Inset Border */}
      {variant === 'brand' && (
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          rx="20"
          stroke="url(#goldGrad)"
          strokeWidth="1.8"
          strokeDasharray="5 3"
          opacity="0.4"
        />
      )}

      {/* 3. High-Fidelity Adapted Scaled Logo Group */}
      <g transform="translate(50, 48) scale(1.4)">
        
        {/* House Roof Accent with rich gradient and thick bold stroke */}
        <path
          d="M -24 -8 L 0 -24 L 24 -8"
          stroke={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#8a5c38')}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Traditional Four-Pane Window - Bolded */}
        <g fill={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#8a5c38')}>
          <rect x="-3" y="-18" width="2.4" height="2.4" rx="0.4" />
          <rect x="0.6" y="-18" width="2.4" height="2.4" rx="0.4" />
          <rect x="-3" y="-15" width="2.4" height="2.4" rx="0.4" />
          <rect x="0.6" y="-15" width="2.4" height="2.4" rx="0.4" />
        </g>

        {/* Sofa Backrest Cushion - Bolder outlines */}
        <path
          d="M -13 4 C -12.5 -4.5, 12.5 -4.5, 13 4 C 13 9, -13 9, -13 4 Z"
          fill={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#9a714a')}
          stroke={variant === 'brand' ? '#4a301a' : (variant === 'light' ? 'rgba(255,255,255,0.7)' : '#725134')}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Backrest Edge Highlight for realistic plush leather look */}
        <path
          d="M -11 3 C -10.5 -2.5, 10.5 -2.5, 11 3"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Sofa Tufted Decoration Buttons - Bolded */}
        <circle cx="-3.5" cy="-0.5" r="1.3" fill={variant === 'brand' ? '#ffffff' : colors.primary} opacity="0.95" />
        <circle cx="3.5" cy="-0.5" r="1.3" fill={variant === 'brand' ? '#ffffff' : colors.primary} opacity="0.95" />

        {/* Left Rolled Armrest - Bolder outlines */}
        <path
          d="M -13 3 C -17 -1, -22 1, -21.5 5 C -21 10, -15 14, -12 12.5 C -10.5 11.5, -11 7, -13 3 Z"
          fill={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#9a714a')}
          stroke={variant === 'brand' ? '#4a301a' : (variant === 'light' ? 'rgba(255,255,255,0.7)' : '#725134')}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Left Armrest Highlight */}
        <path d="M -19 4.5 C -19.5 7, -16 11, -14 11" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />

        {/* Right Rolled Armrest - Bolder outlines */}
        <path
          d="M 13 3 C 17 -1, 22 1, 21.5 5 C 21 10, 15 14, 12 12.5 C 10.5 11.5, 11 7, 13 3 Z"
          fill={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#9a714a')}
          stroke={variant === 'brand' ? '#4a301a' : (variant === 'light' ? 'rgba(255,255,255,0.7)' : '#725134')}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Right Armrest Highlight */}
        <path d="M 19 4.5 C 19.5 7, 16 11, 14 11" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />

        {/* Symmetrical Thick Seat Cushion - Bolder outlines */}
        <path
          d="M -13 7.5 C -13 5.5, 13 5.5, 13 7.5 C 13 12, -13 12, -13 7.5 Z"
          fill={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#ab7e54')}
          stroke={variant === 'brand' ? '#4a301a' : (variant === 'light' ? 'rgba(255,255,255,0.7)' : '#725134')}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Seat Cushion Crease Accent */}
        <path
          d="M -11.5 9 Q 0 10 11.5 9"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Hardwood Under-Base Trim */}
        <path
          d="M -14.5 12 C -11 14, 11 14, 14.5 12 L 13.5 14.5 C 9 15.6, -9 15.6, -13.5 14.5 Z"
          fill={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#8a5c38')}
          opacity="0.95"
        />

        {/* Left Sofa Leg - Bolder */}
        <path
          d="M -11.5 14.3 L -13 18 L -10 18 L -9.5 14.3 Z"
          fill={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#8a5c38')}
        />

        {/* Right Sofa Leg - Bolder */}
        <path
          d="M 11.5 14.3 L 13 18 L 10 18 L 9.5 14.3 Z"
          fill={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#8a5c38')}
        />

        {/* Ground Support Swoop Accent - Left */}
        <path
          d="M -11 17 C -15 17, -21 17.8, -23.5 18.5 L -22.5 19 Q -13 18 -10 17.5 Z"
          fill={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#8a5c38')}
          opacity="0.75"
        />

        {/* Ground Support Swoop Accent - Right */}
        <path
          d="M 11 17 C 15 17, 21 17.8, 23.5 18.5 L 22.5 19 Q 13 18 10 17.5 Z"
          fill={variant === 'brand' ? 'url(#goldGrad)' : (variant === 'light' ? '#ffffff' : '#8a5c38')}
          opacity="0.75"
        />

      </g>
    </svg>
  );
}
