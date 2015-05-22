function getSetup() {
  return {
    username: document.getElementById("username").value,
    email: document.getElementById("emailaddress").value,
    password: CryptoJS.SHA256(document.getElementById("password").value).toString()
  };
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

function signup() {
  var values = getSetup();
  var req = {
    type: "user",
    action: "signup",
    user: values
  };
  datastore(req,function (res) {
    if (res.success) {
      window.location.assign("blog.html");
    } else {
      error(res.error);
    }
  });
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
        window.location.assign("blog.html");
      } else {
        message("Invalid username or password.");
      }
    } else {
      error(res.error);
    }
  });
}