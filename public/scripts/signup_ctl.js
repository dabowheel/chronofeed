function clickSignup() {
  var values = getSignup();

  if (!validate(values)) {
    return;
  }

  datastore("POST","/datastore/user",values,function (err,res) {
    if (err) {
      error(err);
    } else {
      window.location.assign("blog.html");
    }
  });
}

function getSignup() {
  return {
    username: document.getElementById("username").value,
    email: document.getElementById("emailaddress").value,
    password: CryptoJS.SHA256(document.getElementById("password").value).toString(),
    passwordLength: document.getElementById("password").value.length
  };
}

function validate(values) {
  if (!values.username) {
    message("username is required");
    return false;
  } else if (!values.email) {
    message("email address is required");
    return false;
  } else if (!values.passwordLength) {
    message("password is required");
    return false;
  }
  return true;
}

function message(str) {
  var e = document.getElementById("message");
  e.style.color = "red";
  e.innerHTML = str;
}
