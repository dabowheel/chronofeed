var g_userID;

function viewLogin() {
  document.getElementById("main").innerHTML = g_templateList.login;
}

function getLoginFormValues() {
  return {
    username: document.getElementById("inputUsername").value,
    password: CryptoJS.SHA256(document.getElementById("inputPassword").value).toString()
  };
}

function getPasswordPlain() {
  return document.getElementById("inputPassword").value;
}

function validateLoginForm(values,passwordPlain) {
  var valid = true;

  if (values.username == "") {
    $("#inputUsernameFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputUsernameFormGroup").removeClass("has-error");
  }

  if (passwordPlain == "") {
    $("#inputPasswordFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputPasswordFormGroup").removeClass("has-error");
  }

  return valid;
}

function login() {
  var values = getLoginFormValues();
  if (!validateLoginForm(values, getPasswordPlain())) {
    return;
  }

  datastore("POST", "login", values, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }
    if (res.success) {
        g_userID = res.userID;
        viewBlogList();
    } else {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html("Invalid username or password.");
    }
  });
}
