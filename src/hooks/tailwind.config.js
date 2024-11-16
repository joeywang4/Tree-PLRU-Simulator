// a workaround since create-react-app does not allow importing from outside src
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
