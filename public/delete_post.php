<?php
  $dbopts = parse_url(getenv('DATABASE_URL'));
  $dbname = ltrim($dbopts["path"],"/");
  $password = ltrim($dbopts["pass"],":");
  $connection = "host=$dbopts[host] dbname=$dbname user=$dbopts[user] password=$password";
  $dbconn = pg_connect($connection);

  $query = "DELETE FROM posts WHERE post_id = '$_GET[id]'";
  $result = pg_query($query);
  
  if ($result) {
    $line = pg_fetch_array($result, NULL, PGSQL_ASSOC);
    echo <<<EOD
    {
      "success": true
    }
EOD;
  } else {
    $error = pg_last_error();
    echo <<<EOD
    {
      "success": false,
      "error": "Query failed: $error"
    }
EOD;
  }

  pg_free_result($result);
  pg_close($dbconn);
?>