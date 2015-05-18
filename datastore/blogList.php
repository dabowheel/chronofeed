<?php

  function echoLoadBlogList($dbconn) {
    // get blog title
    $query = "select blog_id,title FROM blogs ORDER BY title ASC";
    $result = pg_query($query);

    if (!$result) {
      echoQueryFailed();
      exit;
    }

    echo <<<EOD
    {
      "success": true,
      "blogList": {
        "list": [
EOD;
    $i = 0;
    while ($line = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
      if ($i++ > 0) {
        echo ",";
      }
      echo <<<EOD
        {
          "blogID": "$line[blog_id]",
          "title": "$line[title]"
        }
EOD;
    }
    echo "]}}";

    pg_free_result($result);
  }

?>