
function clickSignup() {
  var values = getSignupFormValues();

  if (!validate(values, getPasswordPlain())) {
    return;
  }

  datastore("POST","signup",values,function (err,res) {
    if (err) {
      error(err);
    } else {
      window.location.assign("blog.html");
    }
  });
}

function getSignupFormValues() {
  return {
    username: document.getElementById("inputUsername").value,
    email: document.getElementById("inputEmail").value,
    password: CryptoJS.SHA256(getPasswordPlain()).toString(),
  };
}

function getPasswordPlain() {
  return document.getElementById("inputPassword").value;
}

function validate(values,passwordPlain) {
  var valid = true;

  if (values.username == "") {
    $("#inputUsernameFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputUsernameFormGroup").removeClass("has-error");
  }

  if (values.email == "") {
    $("#inputEmailFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputEmailFormGroup").removeClass("has-error");
  }

  if (passwordPlain == "") {
    $("#inputPasswordFormGroup").addClass("has-error");
    valid = false;
  } else if (passwordPlain.length < 8) {
    $("#inputPasswordFormGroup").addClass("has-error");
    $("#placeForAlert").addClass("alert alert-warning");
    $("#placeForAlert").html("Password length must be greater than 8 characters.");
    valid = false;
  } else {
    $("#inputPasswordFormGroup").removeClass("has-error");
    $("#placeForAlert").removeClass("alert alert-warning");
    $("#placeForAlert").html("");
  }

  return valid;
}
