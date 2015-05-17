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
  }

  pg_close($dbconn);
?>