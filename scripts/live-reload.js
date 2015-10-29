// include live-reload script
global.liveReload = function () {
  var script = document.createElement("script");
  script.setAttribute("src","http://localhost:1009");
  document.body.appendChild(script);
};
