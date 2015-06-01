

function blogListClick() {
  g_blog = null;
  viewBlogList();
}

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
  viewLogin();
}
