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
?>