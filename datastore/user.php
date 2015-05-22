<?php

  function echoSignup($user) {
    $username = pg_escape_string($user->username);
    $email = pg_escape_string($user->email);
    $password = pg_escape_string($user->password);

    $query = "INSERT INTO users(username,email,password) VALUES('$username','$email','$password') RETURNING user_id";
    $result = pg_query($query);

    if (!$result) {
      echoQueryFailed();
      return;
    }

    $line = pg_fetch_array($result);

    if (!$line) {
      echoError("Failed to get userID");
      return;
    }

    $_SESSION["userID"] = $line["user_id"];

    echo <<<EOD
    {
      "success": true,
      "userID": "$line[user_id]"
    }
EOD;
    pg_free_result($result);
  }

  function echoLogin($user) {
    $username = $user->username;
    $password = $user->password;
    $query = "SELECT user_id FROM users WHERE (username = '$username' OR email = '$username') AND password = '$password'";

    $result = pg_query($query);

    if (!$result) {
      echoQueryFailed();
      return;
    }

    $line = pg_fetch_array($result);

    if ($line) {
      $_SESSION["userID"] = $line["user_id"];      
      echo <<<EOD
      {
        "success": true,
        "login": true,
        "userID": "$line[user_id]"
      }
EOD;
    } else {
      echo <<<EOD
      {
        "success": true,
        "login": false
      }
EOD;
    }
    pg_free_result($result);
  }

  function echoLogout() {
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
      $params = session_get_cookie_params();
      setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
    }
    session_destroy();
    echoEndSession();
  }
?>