function menu2HTML()
{
  html = "";
  html += "<div class=\"menu\">";
  html += "<button onclick=\"blogListClick();\">Blog List</button>"
  html += "<button onclick=\"logoutClick();\">Logout</button>";
  html += "</div>";
  return html;
}

function blogListClick() {
  g_blog = null;
  loadBlogListFromServer();
};

function logoutClick() {
  req = {
    type: "user",
    action: "logout"
  };
  datastore(req,function(res) {
    if (!res.success) {
      error(res.error);
    }
  });
  window.location.assign("login.html");
}