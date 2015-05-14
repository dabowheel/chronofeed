<?php
  $dbopts = parse_url(getenv('DATABASE_URL'));
  $dbname = ltrim($dbopts["path"],"/");
  $password = ltrim($dbopts["pass"],":");
  $connection = "host=$dbopts[host] dbname=$dbname user=$dbopts[user] password=$password";
  $dbconn = pg_connect($connection);

  $postID = pg_escape_string($_POST["postID"]);
  $title = pg_escape_string($_POST["title"]);
  $text = pg_escape_string($_POST["text"]);
  $query = "UPDATE posts SET title = '$title', post = '$text' WHERE post_id = '$postID'";
  $result = pg_query($query);
  
  if ($result) {
    echo "{\"success\":true}";
  } else {
    echo "{\"success\":false,";
    echo "\"message\":\"Unable to save: ".pg_last_error()."\"}";
  }
  pg_free_result($result);
  pg_close($dbconn);
?>