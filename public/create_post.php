<?php
  $dbopts = parse_url(getenv('DATABASE_URL'));
  $dbname = ltrim($dbopts["path"],"/");
  $password = ltrim($dbopts["pass"],":");
  $connection = "host=$dbopts[host] dbname=$dbname user=$dbopts[user] password=$password";
  $dbconn = pg_connect($connection);
  
  $title = pg_escape_string($_POST["title"]);
  $text = pg_escape_string($_POST["text"]);
  $query = "INSERT INTO posts(title,post,date) VALUES('".$title."','".$text."',Now())";
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