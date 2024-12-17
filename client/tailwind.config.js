/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", // Include Flowbite React components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'), // Correctly include Flowbite plugin
    require('tailwind-scrollbar'), // Include Tailwind Scrollbar plugin
  ],
};
