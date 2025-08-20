/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx,mdx}", // 👈 include storybook
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
