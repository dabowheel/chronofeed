<?php
  require_once("general.php");

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
  } elseif ($obj->type == "post") {
    require("post.php");
    if ($obj->action == "create") {
      echoPostID($dbconn,$obj->data);
    }
  }

  pg_close($dbconn);
?>