var express = require('express');
var router = express.Router();
const client = require('../../database/connection');

// id's in mongoDB
var ObjectId = require('mongodb').ObjectId;

// JSON Type Definition
const Ajv = require("ajv/dist/jtd");
const ajv = new Ajv();

// schema
const schema = {
    properties: {
      author: {type: "string"},
      message: {type: "string"},
    },
    optionalProperties: {
    }
  }

const validate = ajv.compile(schema);

// update comment in db
async function updateComment(client, commentId, author, message) {
  const data = {
    author: author,
    message: message
  }

  const valid = validate(data);

  if (!valid) {
    console.log(validate.errors);
  } else {
    await client.db("forum").collection("comments").updateOne({ '_id': ObjectId(commentId) },
    { $set: {author: data.author, message: data.message}});
  }
}

// find post in db
async function findPost(client, postId) {
  const result = await client.db("forum").collection("posts").findOne({_id: ObjectId(postId)});

  if (result) {
      return(result);
  } else {
      return null;
  }
}

// find comments of post
async function findComments(client, postId) {
    const cursor = client.db("forum").collection("comments").find( { postId: postId } );

    const results = await cursor.toArray();

    if (results.length > 0) {
        return results;
    } else {
        return null;
    }
}

/* Update comment */
router.get('/:postId/:commentId/:author/:message', async function(req, res, next) {
    try {
      // connect & check
      await client.connect();
      console.log("Connected to MongoDB on /updateComment");
  
      // update comment
      await updateComment(client, req.params.commentId, req.params.author, req.params.message);
  
      // find post
      let post = await findPost(client, req.params.postId);

      // get comments
      let comments = await findComments(client, req.params.postId);

      // send view with updated comment
      res.render('details', { title: 'Details of post', post: post, comments: comments });
  
    } catch (e) {
        console.error(e);
    } finally {
        // close connection
        await client.close();
    }
});

module.exports = router;