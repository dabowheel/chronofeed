<?php
  $dbconn = pg_connect("host=localhost dbname=blog user=postgres password=l|DeRtYK6x2n") or die("Could not connect: " . pg_last_error());
 
  $query = "select post_id,title,post,date from posts ORDER BY date DESC";
  $result = pg_query($query) or die("Query failed: " . pg_last_error());
  
  echo <<<EOD
  {
    "postList": [
EOD;

  $i = 0;
  while ($line = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
    if ($i > 0) {
      echo ",";
    }
    echo "{";
    echo "\"id\":\"$line[post_id]\",";
    echo "\"title\":\"$line[title]\",";
    echo "\"text\":\"$line[post]\",";
    echo "\"date\":\"$line[date]\"";
    echo  "}";
    $i++;
  }

  echo <<<EOD
  ]}
EOD;

  pg_free_result($result);
  pg_close($dbconn);
?>