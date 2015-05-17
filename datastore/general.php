<?php

  function encodeJSONString($str) {
    return substr(json_encode($str),1,-1);
  }

  function getConnection() {
    $dbopts = parse_url(getenv('DATABASE_URL'));
    $dbname = ltrim($dbopts["path"],"/");
    $password = ltrim($dbopts["pass"],":");
    $connection = "host=$dbopts[host] dbname=$dbname user=$dbopts[user] password=$password";
    $dbconn = pg_connect($connection);
    return $dbconn;
  }

  function echoConnectionError() {
    $error = "Could not connect: ".$connection.": ".encodeJSONString(pg_last_error());
    echo <<<EOD
    {
      "success": false,
      "error":"$error"
    }
EOD;
  }

  function echoQueryFailed($query) {
    $error = "Query failed: ".encodeJSONString(pg_last_error());
    $query = encodeJSONString($query);
    echo <<<EOD
    {
      "success":false,
      "error":"$error",
      "debug":"$query"
    }
EOD;
  }

  function echoInvalidBlogID($blogID) {
    echo <<<EOD
    {
      "success":false,
      "data":"Invalid blog ID: $blogID"
    }
EOD;
  }

function getJSONObject() {
  $json = file_get_contents('php://input');
  $obj = json_decode($json);
  return $obj;
}

?>