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
      require("blogInfo.php");

    if ($obj->action == "save") {
      echoUpdateBlogInfo($obj->blogInfo);
    } elseif ($obj->action == "create") {
      echoCreateBlogInfo($obj->blogInfo);
    }

  } elseif ($obj->type == "post") {
    require("post.php");

    if ($obj->action == "save") {
      echoSavePost($dbconn,$obj->post);
    } elseif ($obj->action == "create") {
      echoCreatePost($dbconn,$obj->post);
    } elseif ($obj->action == "delete") {
      echoDeletePost($dbconn,$obj->postID);
    }

  } elseif ($obj->type == "blogList") {
    require("blogList.php");
    
    if ($obj->action == "load") {
      echoLoadBlogList($dbconn);
    }
  }

  pg_close($dbconn);
?>