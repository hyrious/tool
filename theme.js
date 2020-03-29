(function() {
  const theme = {
    light: {
      back: "white",
      front: "black",
      link: "blue",
      control: "rgba(silver,.25)",
    },
    dark: {
      back: "black",
      front: "white",
      link: "aqua",
      control: "rgba(gray,.25)",
    },
  };
  const colors = {
    aqua: "#7fdbff",
    blue: "#0074d9",
    lime: "#01ff70",
    navy: "#001f3f",
    teal: "#39cccc",
    olive: "#3d9970",
    green: "#2ecc40",
    red: "#ff4136",
    maroon: "#85144b",
    orange: "#ff851b",
    purple: "#b10dc9",
    yellow: "#ffdc00",
    fuchsia: "#f012be",
    gray: "#aaaaaa",
    white: "#ffffff",
    black: "#111111",
    silver: "#dddddd"
  };
  function rgb(hex) {
    hex = hex.replace(/^#/, '');
    const f = i => parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    return Array(3).fill().map((_, i) => f(i)).join(',');
  }
  function updateTheme(e) {
    const root = document.documentElement;
    for (const [k, v] of Object.entries(theme[e.matches ? "dark" : "light"])) {
      if (v.startsWith('rgba(')) {
        const m = v.match(/rgba\((\w+),(.+)\)/);
        root.style.setProperty(`--${k}`, `rgba(${rgb(colors[m[1]])},${m[2]})`);
      } else {
        root.style.setProperty(`--${k}`, colors[v]);
      }
    }
  }
  updateTheme(prefersDarkMediaQueryList);
  prefersDarkMediaQueryList.addListener(updateTheme);
})();
