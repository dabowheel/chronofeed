<!DOCTYPE html>
<html>
  <head>
    <script src="scripts/blog.js"></script>
  </head>
  <body onload="loadPosts();">
    <h1>Blog</h1>
    <div id="message"></div>
    <div id="posts"></div>
    <h2>New Post</h2>
    <div style="max-width:800px;">
      <div><input id="title" type="text" style="width:100%;box-sizing:border-box;"/></div>
      <div><textarea id="text" rows="5" style="width:100%;box-sizing:border-box;"></textarea></div>
      <div><button id="submit" onclick="savePost();">Post</button></div>
    </div>
  </body>
</html>