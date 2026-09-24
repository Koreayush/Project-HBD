/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F3',
        blush: '#FFDDE6',
        petal: '#FFB8CE',
        lilac: '#E4DAFF',
        peach: '#FFDCC6',
        plum: '#3D2340',
        mauve: '#7A5A78',
        rosedeep: '#C43D72',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['Caveat', '"Segoe Script"', 'cursive'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
