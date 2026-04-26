/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef7ee",
          100: "#fde7cc",
          500: "#e67e22",
          700: "#b85d12",
          900: "#7a3908"
        }
      },
      boxShadow: {
        soft: "0 15px 40px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

