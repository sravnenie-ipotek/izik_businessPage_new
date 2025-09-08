/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./scaffold/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBg: '#010101',
        brandText: '#ffffff',
        brandMuted: '#b3b3b3',
        brandLink: '#ffffff',
        brandLinkHover: 'rgba(255, 255, 255, 0.8)',
        brandBtn: '#fc5a2b',
        brandBtnText: '#ffffff',
        brandBtnBorder: '#fc5a2b',
        brandOrange: '#fc5a2b',
        brandGray: '#b3b3b3',
        brandLightGray: '#f2f2f2',
      },
      fontFamily: {
        heading: ['Bebas Neue', 'Impact', sans-serif],
        body: ['Inter', 'Roboto', sans-serif],
      },
      fontSize: {
        'heading-xl': ['140px', '1.1'],
        'heading-lg': ['100px', '1.1'],
        'heading-md': ['80px', '1.1'],
        'heading-sm': ['60px', '1.1'],
        'heading-xs': ['24px', '1.1'],
        'body-sm': ['14px', '1.7'],
      },
      letterSpacing: {
        tightXs: '-0.01em',
        tightSm: '-0.02em',
        wideSm: '0.05em',
        wideMd: '0.1em',
        wideLg: '0.15em',
      },
      lineHeight: {
        'heading': '1.1',
        'body': '1.7',
      },
      maxWidth: {
        'container': '1440px',
      },
      spacing: {
        'sectionY': '5rem', // 80px
        'sectionYLg': '7.5rem', // 120px
        'innerGap': '2rem', // 32px
      },
      height: {
        'input': '48px',
        'button': '45px',
        'buttonSm': '40px',
      },
      borderRadius: {
        'input': '0px',
        'button': '0px',
      },
      borderWidth: {
        'input': '1px',
        'button': '0px',
      },
      animation: {
        'slideInUp': 'slideInUp 0.6s ease-out',
        'fadeIn': 'fadeIn 0.8s ease-out',
        'rotateIn': 'rotateIn 0.5s ease-out',
      },
      keyframes: {
        slideInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-90deg)', opacity: '0' },
          '100%': { transform: 'rotate(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '390px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1440px',
      },
    },
  },
  plugins: [],
}