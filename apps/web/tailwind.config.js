const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          1: 'hsl(240, 5.0%, 9.8%)',
          2: 'hsl(240, 6.9%, 11.4%)',
          3: 'hsl(227, 6.7%, 16.4%)',
          4: 'hsl(222, 6.6%, 19.4%)',
          5: 'hsl(218, 6.5%, 22.1%)',
          6: 'hsl(214, 6.4%, 25.1%)',
          7: 'hsl(209, 6.2%, 29.4%)',
          8: 'hsl(202, 5.8%, 37.5%)',
          9: 'hsl(220, 6.0%, 44.0%)',
          10: 'hsl(218, 5.3%, 51.5%)',
          11: 'hsl(220, 7.0%, 70.0%)',
          12: 'hsl(220, 7.0%, 93.5%)',
        },
      },
    },
  },
  plugins: [],
};
