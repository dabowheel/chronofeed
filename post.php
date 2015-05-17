<?php
  require("php/datastore.php");

  $dbonn = getConnection()
  if (!$dbconn) {
    echoConnectionError();
    exit;
  }

  $obj = getJSONObject();

  if ($obj->action == "create") {
  }

  pg_close($dbconn);
?>