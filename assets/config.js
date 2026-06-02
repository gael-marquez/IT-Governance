/* Tailwind Play CDN configuration — shared across all pages */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        guinda: {
          50:'#fbf1f5',100:'#f7e2ea',200:'#eebccf',300:'#e08fae',
          400:'#cd5c84',500:'#b13a64',600:'#94274d',700:'#7a1e3f',
          800:'#651a35',900:'#56172f',950:'#330a19'
        },
        brand: {
          50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',
          400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',
          800:'#3730a3',900:'#312e81'
        }
      },
      keyframes: {
        floaty: { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-14px)'} },
      },
      animation: { floaty: 'floaty 9s ease-in-out infinite' }
    }
  }
}
