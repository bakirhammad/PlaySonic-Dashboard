/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-bs-theme="dark"]'],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  prefix: "tw-",
  theme: {
    extend: {
      boxShadow: {
        "custom-shadow": "0px 4px 15px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        spin: "spin 0.3s linear",
        pulse: "pulse 0.3s cubic-bezier(0.4, 0, 0.6, 1)",
      },
    },
  },
  plugins: [],
};
