<?php
  require_once("general.php");
  require("blog.php");

  $dbconn = getConnection();
  if (!$dbconn) {
    echoConnectionError();
    exit;
  }

  $obj = getJSONObject();

  if ($obj->type == "blog") {
    if ($obj->action == "load") {
      echoBlog($dbconn,$obj->data);
    }
  }

  pg_close($dbconn);
?>