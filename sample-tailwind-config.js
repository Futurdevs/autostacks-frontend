module.exports = {
    darkMode: 'class', // Enable dark mode
    theme: {
      extend: {
        colors: {
          primary: {
            light: '#ff8aff', // Neon pink
            DEFAULT: '#d726ff', // Bright purple
            dark: '#8c1aff', // Deep purple
          },
          accent: {
            light: '#ffac5e', // Soft neon orange
            DEFAULT: '#ff6b00', // Bright orange
            dark: '#c65000', // Deep orange
          },
          background: {
            light: '#1a1a2e', // Dark background (light mode)
            DEFAULT: '#0d0d1a', // Default background (dark mode)
            deep: '#05050e', // Deep black
          },
          glow: {
            pink: '#ff00ff',
            purple: '#8a2be2',
            blue: '#00ffff',
          },
        },
        boxShadow: {
          'neon-pink': '0 0 10px #ff00ff',
          'neon-purple': '0 0 10px #8a2be2',
          'neon-blue': '0 0 10px #00ffff',
        },
      },
    },
    plugins: [],
  };
  