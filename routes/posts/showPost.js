var express = require('express');
var router = express.Router();
const client = require('../../database/connection');

// id's in mongoDB
var ObjectId = require('mongodb').ObjectId

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

/* Send post to view */
router.get('/:postId', async function(req, res, next) {
  try {
    // connect & check
    await client.connect();
    console.log("Connected to MongoDB on /showPost");

    // get requested post
    let post = await findPost(client, req.params.postId);

    // get comments of the post
    let comments = await findComments(client, req.params.postId);

    // send post to view
    res.render('details', { title: 'Details of post', post: post, comments: comments });

  } catch (e) {
      console.error(e);
  } finally {
      // close connection
      await client.close();
  }
});

module.exports = router;
