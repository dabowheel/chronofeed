<?php
  //connect
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

  // get blog title
  $query = "select blogID,title FROM blogs";
  $result = pg_query($query);

  if (!$result) {
    $error = "Query failed: ".pg_last_error();
    echo <<<EOD
    {
      "error": "$error"
    }
EOD;
    pg_close($dbconn);
    exit;
  }

  echo "{";
  $i = 0;
  while ($line = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
    if ($i > 0) {
      echo ",";
    }
    echo <<<EOD
      {
        blogID: $line[blogID],
        title: $line[title]
      }
EOD;
  }
  echo "}";

  pg_free_result($result);
  pg_close($dbconn);  
?>