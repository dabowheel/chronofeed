<?php
  function echoUpdateBlogInfo($blogInfo) {
    $query = "UPDATE blogs SET title = '$blogInfo->title' WHERE blog_id = '$blogInfo->blogID'";
    $result = pg_query($query);
    
   if (!$result) {
      echoQueryFailed();
      return;
    }

    echo "{\"success\":true}";

    pg_free_result($result);
  }

  function echoCreateBlogInfo($blogInfo) {
    $title = pg_escape_string($blogInfo->title);
    $query = "INSERT INTO blogs(title) VALUES('$title') RETURNING blog_id";
    $result = pg_query($query);
    if (!$result) {
      echoQueryFailed();
      exit;
    }
    $line = pg_fetch_array($result, NULL, PGSQL_ASSOC);
    echo <<<EOD
    {
      "success": true,
      "blogID": "$line[blog_id]"
    }
EOD;
    pg_free_result($result);
  }

  function echoDeleteBlogInfo($blogID) {
    $query = "DELETE FROM blogs WHERE blog_id='$blogID'";
    $result = pg_query($query);

    if (!$result) {
      echoQueryFailed();
      return;
    }

    echo <<<EOD
    {
      "success": true
    }
EOD;

    pg_free_result($result);
  }
?>