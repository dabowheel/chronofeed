<?php
  $dbconn = pg_connect("host=localhost dbname=blog user=postgres password=l|DeRtYK6x2n") or die("Could not connect: " . pg_last_error());

  $id = pg_escape_string($_POST["id"]);
  $title = pg_escape_string($_POST["title"]);
  $text = pg_escape_string($_POST["text"]);
  $query = "UPDATE posts SET title = '$title', post = '$text' WHERE post_id = '$id'";
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