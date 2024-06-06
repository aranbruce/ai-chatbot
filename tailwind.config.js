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
      },
      animation: {
        message_appear: "message_appear 0.1s ease-in-out forwards",
      },
      backgroundImage: {
        claude: "url('/images/logos/claude.svg')",
        gemini: "url('/images/logos/gemini.svg')",
        mistral: "url('/images/logos/mistral.svg')",
        openai: "url('/images/logos/openai.svg')",
      },
    },
  },
  plugins: [],
};
