(function() {
  const theme = {
    light: {
      back: "white",
      front: "black",
      link: "blue",
    },
    dark: {
      back: "black",
      front: "white",
      link: "aqua",
    }
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
  function updateTheme(e) {
    const root = document.documentElement;
    for (const [k, v] of Object.entries(theme[e.matches ? "dark" : "light"])) {
      root.style.setProperty(`--${k}`, colors[v]);
    }
  }
  updateTheme(prefersDarkMediaQueryList);
  prefersDarkMediaQueryList.addListener(updateTheme);
})();
