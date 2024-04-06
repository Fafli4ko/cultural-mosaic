/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F3F5F2",
        contrastBg: "#ECEDEA",
        primary: "#51829B",
        selected: "#9BB0C1",
        contrast: "#9BB0C1",
        orange: "#F29C1F",
        selectOrange: "#F18F01",
        lightOrange: "#F6B557",
        blue: "#45ABB8",
        contrastBlue: "#3C95A0",
        mWhite: "#FFFFFF",
        mContrastWhite: "#E0E0E0",
      },
    },
  },
  plugins: [],
};
