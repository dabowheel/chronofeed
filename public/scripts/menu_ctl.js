
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