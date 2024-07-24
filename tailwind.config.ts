import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        gray: {
          subtext: "#8C8C8C"
        },
        dark: {
          maintext: "#1E1E1E"
        },
        yellow: {
          secondary: "#FFCC02",
          accent: "#FFB300"
        },
        red: {
          secondary: "#FE0100",
          accent: "#FF2424"
        },
        green: {
          secondary: "#34CC33",
          accent: "#26B43C"
        },
        blue: {
          secondary: "#3300CC",
        }
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        robotoSlab: ["var(--font-roboto-slab)"],
      },
    },
  },
  plugins: [],
};
export default config;
