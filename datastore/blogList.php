<?php

  function echoLoadBlogList($dbconn) {
    // get blog title
    $query = "select blog_id,title,user_id FROM blogs WHERE user_id = '$_SESSION[userID]' ORDER BY title ASC";
    $result = pg_query($query);

    if (!$result) {
      echoQueryFailed();
      exit;
    }

    echo <<<EOD
    {
      "success": true,
      "blogList": {
        "userID": "$_SESSION[userID]",
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
          "title": "$line[title]",
          "userID": "$line[user_id]"
        }
EOD;
    }
    echo "]}}";

    pg_free_result($result);
  }

?>