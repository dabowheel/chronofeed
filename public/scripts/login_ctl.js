var g_userID;

function viewLogin() {
  document.getElementById("main").innerHTML = g_templateList.login;
}

function getLogin() {
  return {
    username: document.getElementById("username").value,
    password: CryptoJS.SHA256(document.getElementById("password").value).toString()
  };
}

function message(str) {
  e = document.getElementById("message");
  e.innerHTML = str;
  e.style.display = "block";
  e.style.color = "red";
}


function login() {
  var values = getLogin();
  var req = {
    type: "user",
    action: "login",
    user: values
  };
  datastore(req,function (res) {
    if (res.success) {
      if (res.login) {
        g_userID = res.userID;
        viewBlogList();
      } else {
        message("Invalid username or password.");
      }
    } else {
      error(res.error);
    }
  });
}
