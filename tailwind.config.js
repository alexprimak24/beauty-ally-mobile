/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        dark: '#212529',
        darkDisabled: 'rgba(33, 37, 41, 0.6)',
        lightBg: '#f4f6f8',
        lightGreen: '#d6f5d6',
        lightGreenBorder: 'rgba(194, 234, 194, 0.15)',
        lightBlue: '#def2ff',
        lightBlueBorder: 'rgba(200, 233, 255, 0.15)',
        lightPink: '#fdebf6',
        lightPinkBorder: 'rgba(247, 214, 234, 0.15)',
        strongRed: '#e75a7c',
        primaryRed: '#ffe5e5',
        primaryYellow: '#ffe4b5',
        primaryGreen: '#d6f5d6',
        primaryBlue: '#def2ff',
        whiteSemi: 'rgba(255,255,255,0.9)',
      },
      fontFamily: {
        // sans is overriten which makes it a default font
        sans: ['InstrumentSans-Regular'],
        iSans: ['InstrumentSans-Regular'],
        iSansI: ['InstrumentSans-Italic'],
        iSansM: ['InstrumentSans-Medium'],
        iSansSB: ['InstrumentSans-SemiBold'],
        iSansB: ['InstrumentSans-Bold'],

        quicksand: ['Quicksand-Regular'],
        quicksandMedium: ['Quicksand-Medium'],
        quicksandSemiBold: ['Quicksand-SemiBold'],
        quicksandBold: ['Quicksand-Bold'],
      },
      dropShadow: {
        scanEntryShadow: '2px_3px_2px_rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}

// Bold font - 700
// Semibold - 600
// Medium - 500
// Regular - 400
// Light - 300
