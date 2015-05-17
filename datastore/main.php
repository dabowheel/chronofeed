<?php
  require("general.php");

  $dbconn = getConnection();
  if (!$dbconn) {
    echoConnectionError();
    exit;
  }

  $obj = getJSONObject();

  if ($obj->type == "blog") {
    if ($obj->action == "load") {
      require("blog.php");
      echoBlog($dbconn,$obj->blogID);
    }
  } elseif ($obj->type == "blogInfo") {
    if ($obj->action == "save") {
      require("blogInfo.php");
      echoUpdateBlogInfo($obj->blogInfo);
    }
  } elseif ($obj->type == "post") {
    require("post.php");
    if ($obj->action == "save") {
      echoSavePost($dbconn,$obj->post);
    } else if ($obj->action == "create") {
      echoCreatePost($dbconn,$obj->post);
    } else if ($obj->action == "delete") {
      echoDeletePost($dbconn,$obj->postID);
    }
  }

  pg_close($dbconn);
?>