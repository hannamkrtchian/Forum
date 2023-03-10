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

/* Edit post page */
router.get('/:postId', async function(req, res, next) {
    try {
        // connect & check
        await client.connect();
        console.log("Connected to MongoDB on /editPost");
    
        // get requested post
        let post = await findPost(client, req.params.postId);
    
        // send post to view
        res.render('editPost', { title: 'Edit post', post: post });
    
      } catch (e) {
          console.error(e);
      } finally {
          // close connection
          await client.close();
      }
});

module.exports = router;
