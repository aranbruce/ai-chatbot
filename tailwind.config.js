/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        message_appear: {
          "0%": {
            opacity: 0,
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        text_loading: {
          "0%, 100%": {
            opacity: 0.5,
          },
          "50%": {
            opacity: 0,
          },
        },
      },
      animation: {
        message_appear: "message_appear 0.1s ease-in-out forwards",
        text_loading: "text_loading 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
