import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        // définit les variables si nécessaire
        'spacing': '1rem',
      },
    },
  },
  plugins: [],
});
