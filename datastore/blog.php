<?php
  require_once("general.php");
  
  function echoBlog($dbconn,$blogID) {
    // get blog title
    $query = "select title FROM blogs WHERE blog_id = '$blogID'";
    $result = pg_query($query);
    if (!$result) {
      var_dump(pg_last_error());
      echoQueryFailed($query);
      pg_close($dbconn);
      exit;
    }

    $line = pg_fetch_array($result,NULL,PGSQL_ASSOC);
    if (!$line) {
      echoInvalidBlogID($_GET["blogID"]);
      pg_close($dbconn);
      exit;
    }

    $title = $line["title"];
    pg_free_result($result);

    // get posts
    $query = "select post_id,title,post,date from posts WHERE blog_id = '$blogID' ORDER BY date DESC";
    $result = pg_query($query);
    if (!$result) {
      echoQueryFailed($query);
      pg_close($dbconn);
      exit;
    }
    
    echo <<<EOD
{
  "success": true,
  "blog": {
    "blogID": "$_GET[blogID]",
    "title": "$title",
    "postList": [
EOD;

  $i = 0;
  while ($line = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
    if ($i > 0) {
      echo ",";
    }
    echo <<<EOD
      {
        "postID":"$line[post_id]",
        "title":"$line[title]",
        "text":"$line[post]",
        "date":"$line[date]"
      }
EOD;
    $i++;
  }

  echo "]}}";

  pg_free_result($result);
  }

?>