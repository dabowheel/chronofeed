<?php

  function echoPostID($dbconn,$post) {
    $blogID = pg_escape_string($_POST["blogID"]);
    $title = pg_escape_string($_POST["title"]);
    $text = pg_escape_string($_POST["text"]);
    $query = "INSERT INTO posts(title,post,date,blog_id) VALUES('$title','$text',Now(),'$blogID') RETURNING post_id";
    $result = pg_query($query);
    
    if ($result) {
      $line = pg_fetch_array($result, NULL, PGSQL_ASSOC);
      echo <<<EOD
      {
        "success": true,
        "postID": $line[post_id]
      }
EOD;
    } else {
      echo "{\"success\":false,";
      echo "\"message\":\"Unable to save: ".pg_last_error()."\"}";
    }
    pg_free_result($result);
    pg_close($dbconn);
  }
?>