<?php
  $dbopts = parse_url(getenv('DATABASE_URL'));
  $dbname = ltrim($dbopts["path"],"/");
  $password = ltrim($dbopts["pass"],":");
  $connection = "host=$dbopts[host] dbname=$dbname user=$dbopts[user] password=$password";
  $dbconn = pg_connect($connection);

  if (!$dbconn) {
    $error = "Could not connect: ".$connection.": ".pg_last_error();
    echo <<<EOD
    {
      "error": "$error"
    }
EOD;
    exit;
  }

  $blogID = pg_escape_string($_GET["blogID"]);
  $title = pg_escape_string($_GET["title"]);
  $query = "UPDATE blogs SET title = '$title' WHERE blog_id = '$blogID'";
  $result = pg_query($query);
  
 if (!$result) {
    $error = "Query failed: ".pg_last_error();
    echo <<<EOD
    {
      "success": false,
      "error": "$error"
    }
EOD;
    pg_close($dbconn);
    exit;
  }

  echo "{\"success\":true}";

  pg_free_result($result);
  pg_close($dbconn);
?>