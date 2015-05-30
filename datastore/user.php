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

?>