const config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          100: '#f7eefa',
          200: '#e3bfed',
          300: '#cf8bdf',
          400: '#b658c9',
          500: '#853e93',
          600: '#572660',
          700: '#2c1032',
        },
        // Secondary colors
        secondary: {
          100: '#f7eeef',
          200: '#e3bfc4',
          300: '#d38f99',
          400: '#c05d6e',
          500: '#8b424e',
          600: '#5a2831',
          700: '#2d1116',
        },
        tertiary: {
          100: '#f7d0c6',
          200: '#f19d7d',
          300: '#d17242',
          400: '#9d542f',
          500: '#6b381d',
          600: '#3e1d0d',
          700: '#1f0c04',
        },
      },
      fontFamily: {
        'rubik-mono': ['Rubik Mono One', 'monospace'],
        'londrina-outline': ['Londrina Outline', 'cursive'],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
  darkMode: 'class',
};

module.exports = config;
