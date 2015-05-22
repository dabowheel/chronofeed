<?php

  function action($obj) {
    $valid = false;

    if ($obj->type == "user") {
      require_once("user.php");
      if ($obj->action == "signup") {
        echoSignup($obj->user);
        $valid = true;
      } elseif ($obj->action == "login") {
        echoLogin($obj->user);
        $valid = true;
      }
    }

    return $valid;
  }

  function sessionAction($obj) {
    $valid = false;

    if ($obj->type == "blog") {
      if ($obj->action == "load") {
        require("blog.php");
        echoBlog($dbconn,$obj->blogID);
        $valid = true;
      }

    } elseif ($obj->type == "blogInfo") {
      require("blogInfo.php");
      if ($obj->action == "save") {
        echoUpdateBlogInfo($obj->blogInfo);
        $valid = true;
      } elseif ($obj->action == "create") {
        echoCreateBlogInfo($obj->blogInfo);
        $valid = true;
      } elseif ($obj->action == "delete") {
        echoDeleteBlogInfo($obj->blogID);
        $valid = true;
      }

    } elseif ($obj->type == "post") {
      require("post.php");
      if ($obj->action == "save") {
        echoSavePost($dbconn,$obj->post);
        $valid = true;
      } elseif ($obj->action == "create") {
        echoCreatePost($dbconn,$obj->post);
        $valid = true;
      } elseif ($obj->action == "delete") {
        echoDeletePost($dbconn,$obj->postID);
        $valid = true;
      }

    } elseif ($obj->type == "blogList") {
      require("blogList.php");
      if ($obj->action == "load") {
        echoLoadBlogList($dbconn);
        $valid = true;
      }
    
    } elseif ($obj->type == "user") {
      require("user.php");
      if ($obj->action == "logout") {
        echoLogout();
        $valid = true;
      }

    }

    if (!$valid) {
      $valid = action($obj);
    }

    return $valid;
  }

  session_start();
  require("general.php");

  $dbconn = getConnection();
  if (!$dbconn) {
    echoConnectionError();
    exit;
  }

  $obj = getJSONObject();
  if (isLoggedIn()) {
    if (!sessionAction($obj)) {
      echoError("Invalid request");
    }
  } else {
    if (!action($obj)) {
      echoEndSession();
    }
  }

  pg_close($dbconn);

?>