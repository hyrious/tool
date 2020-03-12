(function() {
  const lnk = document.createElement("link");
  lnk.rel = "icon";
  lnk.type = "image/png";
  function updateFavicon(e) {
    lnk.href = `assets/favicon-${e.matches ? "dark" : "light"}.png`;
  }
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addListener(updateFavicon);
  updateFavicon(mql);
  document.head.append(lnk);
  window.prefersDarkMediaQueryList = mql;
})();
