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
  $query = "select title FROM blogs WHERE blog_id = '$_GET[blogID]'";
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

  $line = pg_fetch_array($result,NULL,PGSQL_ASSOC);
  if (!$line) {
    echo <<<EOD
    {
      "error": "Unknown blog ID: $blogID"
    }
EOD;
    pg_close($dbconn);
    exit;
  }

  $title = $line["title"];
  pg_free_result($result);

  // get posts
  $query = "select post_id,title,post,date from posts WHERE blog_id = '$_GET[blogID]' ORDER BY date DESC";
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
  
  // send blog
  echo <<<EOD
  {
    "title": "$title",
    "postList": [
EOD;

  $i = 0;
  while ($line = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
    if ($i > 0) {
      echo ",";
    }
    echo "{";
    echo "\"postID\":\"$line[post_id]\",";
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