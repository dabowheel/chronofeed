#API Documentation

## Loading a Blog

### Request
    {
      "type": "blog",
      "action": "load",
      "blogID": "1"
    }

Replace blogID value with the blog ID.

### Response
    {
      "success": true,
      "blog": {
        "blogID": "1",
        "title": "Javascript",
        "postList": [
          {
            "postID": "1",
            "title": "About Strings",
            "text": "All about strings.",
            "date": "2015-05-16 05:03:18"
          }
        ]
      }
    }


## Updating Blog Title

### Request
    {
      "type": "blogInfo",
      "action": "save",
      "blogInfo": {
        "blogID": "1",
        "title": "Javascript"
      }
    }

### Response
    {
      "success": true
    }

## Saving a Post

### Request
    {
      "type": "post",
      "action": "save",
      "post": {
        "postID": "1",
        "title": "About Strings",
        "text": "All about strings.",
        "date": "2015-05-16 05:03:18"
      }
    }

### Response
    {
      "success": true
    }


## Creating a Post
    {
      "type": "post",
      "action": "save",
      "post": {
        "postID": "",
        "title": "About Strings",
        "text": "All about strings.",
        "date": "2015-05-16 05:03:18"
      }
    }

### Response
    {
      "success": true,
      "postID": 2
    }


## Deleting a Post

### Request
    {
      "type": "post",
      "action": "delete",
      "postID": "1"
    }

### Response
    {
      "success": true
    }
