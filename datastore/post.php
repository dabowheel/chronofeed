<?php
  function echoSavePost($dbconn,$post) {
    $blogID = pg_escape_string($post->blogID);
    $postID = pg_escape_string($post->postID);
    $title = pg_escape_string($post->title);
    $text = pg_escape_string($post->text);
    $query = "UPDATE posts SET title = '$title', post = '$text' WHERE post_id = '$postID' AND blog_id = '$blogID'";
    $result = pg_query($query);
    
    if ($result) {
      echo "{\"success\":true}";
      pg_free_result($result);
    } else {
      echoQueryFailed();
    }
  }

  function echoCreatePost($dbconn,$post) {
    $blogID = pg_escape_string($post->blogID);
    $title = pg_escape_string($post->title);
    $text = pg_escape_string($post->text);
    $userID = pg_escape_string($post->userID);
    $query = "INSERT INTO posts(title,post,date,blog_id,user_id) VALUES('$title','$text',Now(),'$blogID','$userID') RETURNING post_id";
    $result = pg_query($query);
    
    if ($result) {
      $line = pg_fetch_array($result, NULL, PGSQL_ASSOC);
      echo <<<EOD
      {
        "success": true,
        "postID": $line[post_id]
      }
EOD;
      pg_free_result($result);
    } else {
      echoQueryFailed();
    }
  }

  function echoDeletePost($dbconn,$postID) {
    $postID = pg_escape_string($postID);
    $query = "DELETE FROM posts WHERE post_id = '$postID'";
    $result = pg_query($query);
    
    if ($result) {
      $line = pg_fetch_array($result, NULL, PGSQL_ASSOC);
      echo <<<EOD
      {
        "success": true
      }
EOD;
      pg_free_result($result);
    } else {
      echoQueryFailed();
    }
  }
?>