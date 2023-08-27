const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    fontFamily: {
      display: ['Inter'],
    },
    extend: {
      colors: {
        slate: {
          // slate dark
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

          // slate light
          // 1: 'hsl(240, 22.0%, 99.0%)',
          // 2: 'hsl(240, 20.0%, 98.0%)',
          // 3: 'hsl(239, 13.4%, 95.4%)',
          // 4: 'hsl(238, 11.8%, 92.9%)',
          // 5: 'hsl(237, 11.1%, 90.5%)',
          // 6: 'hsl(236, 10.6%, 87.9%)',
          // 7: 'hsl(234, 10.4%, 84.4%)',
          // 8: 'hsl(231, 10.2%, 75.1%)',
          // 9: 'hsl(230, 6.0%, 57.0%)',
          // 10: 'hsl(227, 5.2%, 51.8%)',
          // 11: 'hsl(220, 6.0%, 40.0%)',
          // 12: 'hsl(210, 12.0%, 12.5%)',

          // gold dark
          // 1: 'hsl(44, 9.0%, 8.3%)',
          // 2: 'hsl(45, 8.0%, 9.8%)',
          // 3: 'hsl(44, 9.5%, 13.0%)',
          // 4: 'hsl(43, 10.5%, 15.6%)',
          // 5: 'hsl(42, 11.2%, 18.5%)',
          // 6: 'hsl(41, 12.1%, 22.6%)',
          // 7: 'hsl(39, 13.2%, 29.8%)',
          // 8: 'hsl(35, 14.8%, 45.1%)',
          // 9: 'hsl(36, 20.0%, 49.5%)',
          // 10: 'hsl(36, 21.9%, 56.8%)',
          // 11: 'hsl(35, 30.0%, 71.0%)',
          // 12: 'hsl(35, 25.0%, 88.0%)',

          // olive dark
          // 1: 'hsl(110, 5.0%, 9.2%)',
          // 2: 'hsl(120, 5.7%, 10.4%)',
          // 3: 'hsl(120, 4.3%, 15.4%)',
          // 4: 'hsl(120, 3.9%, 18.5%)',
          // 5: 'hsl(120, 3.6%, 21.2%)',
          // 6: 'hsl(120, 3.3%, 24.3%)',
          // 7: 'hsl(120, 3.0%, 28.7%)',
          // 8: 'hsl(120, 2.6%, 37.1%)',
          // 9: 'hsl(110, 6.0%, 41.5%)',
          // 10: 'hsl(106, 4.6%, 49.3%)',
          // 11: 'hsl(110, 5.0%, 68.8%)',
          // 12: 'hsl(110, 7.0%, 93.0%)',

          // mauve dark
          // 1: 'hsl(300, 5.0%, 9.5%)',
          // 2: 'hsl(300, 7.1%, 11.0%)',
          // 3: 'hsl(290, 6.2%, 16.2%)',
          // 4: 'hsl(285, 5.8%, 19.5%)',
          // 5: 'hsl(280, 5.6%, 22.4%)',
          // 6: 'hsl(276, 5.4%, 25.7%)',
          // 7: 'hsl(269, 5.3%, 30.3%)',
          // 8: 'hsl(258, 5.0%, 39.2%)',
          // 9: 'hsl(250, 5.0%, 45.0%)',
          // 10: 'hsl(252, 4.3%, 52.3%)',
          // 11: 'hsl(250, 6.0%, 70.5%)',
          // 12: 'hsl(240, 7.0%, 93.8%)',

          // sage dark
          // 1: 'hsl(155, 7.0%, 9.2%)',
          // 2: 'hsl(150, 7.7%, 10.2%)',
          // 3: 'hsl(151, 5.5%, 15.2%)',
          // 4: 'hsl(152, 4.7%, 18.3%)',
          // 5: 'hsl(153, 4.2%, 21.1%)',
          // 6: 'hsl(153, 3.7%, 24.2%)',
          // 7: 'hsl(154, 3.3%, 28.7%)',
          // 8: 'hsl(156, 2.6%, 37.1%)',
          // 9: 'hsl(155, 6.0%, 41.5%)',
          // 10: 'hsl(157, 4.6%, 49.2%)',
          // 11: 'hsl(155, 5.0%, 68.3%)',
          // 12: 'hsl(155, 7.0%, 93.0%)',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern:
        /(text|bg|border)-(green|teal|blue|indigo|purple|yellow|orange|red|pink)-(300|500|600)/,
      variants: ['before', 'hover', 'focus', 'selection', '[&>_.track-0]', 'data-[state=active]'],
    },
  ],
};
