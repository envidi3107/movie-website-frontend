const { opacity } = require('@cloudinary/url-gen/actions/adjust');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        spinner: {
          '0%': {
            transform: 'rotate(0)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        },
        moveToRight: {
          'from': {
            'transform': 'translateX(-100%)'
          },
          'to': {
            'transform': 'translateX(0)'
          }
        },
        skeleton: {
          '0%': {
            backgroundColor: '#2c2c2e', // xám đậm
          },
          '50%': {
            backgroundColor: '#3a3a3c', // xám trung bình sáng hơn tí
          },
          '100%': {
            backgroundColor: '#2c2c2e',
          }
        },
        dance: {
          '0%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-5px)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        },
        fadeIn: {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        },
        fadeOut: {
          '0%': {
            opacity: 1
          },
          '100%': {
            opacity: 0
          }
        },
        notify: {
          '0%': { top: '-50px' },
          '80%': { top: '20px' },
          '100%': { top: '0px' },
        },
        ring: {
          '0%': {
            transform: 'rotate(-30deg)'
          },
          '20%': {
            transform: 'rotate(30deg)'
          },
          '40%': {
            transform: 'rotate(-15deg)'
          },
          '60%': {
            transform: 'rotate(15deg)'
          },
          '80%': {
            transform: 'rotate(0)'
          },
        },
        moveToTop: {
          '0%': {
            transform: 'translateY(15px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0px)',
            opacity: '1'
          }
        },
        shimmer: {
          '0%': {
            'background-position': '-200% 0'
          },
          '100%': {
            'background-position': '200% 0'
          }
        },
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        }

      },
      animation: {
        spinner: 'spinner 0.5s ease infinite',
        moveToRight: 'moveToRight 0.8s ease-out',
        moveToTop: 'moveToTop 0.6s ease-out',
        skeleton: 'skeleton 1.5s linear infinite',
        dance: 'dance 0.6s ease-in-out',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeOut: 'fadeOut 0.5s ease-in-out',
        notify: 'notify 0.5s ease-in-out',
        ring: 'ring 1s linear infinite',
        shimmer: 'shimmer 1.5s infinite',
        cursor: 'cursor-blink 1s step-start infinite'
      }
    },
  },
  plugins: []
};
