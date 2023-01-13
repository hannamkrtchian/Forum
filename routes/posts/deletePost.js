var express = require('express');
var router = express.Router();
const client = require('../../database/connection');

// id's in mongoDB
var ObjectId = require('mongodb').ObjectId

async function deletePost(client, postId) {
    await client.db("forum").collection("posts").deleteOne({ '_id': ObjectId(postId) });
}

/* Delete post */
router.get('/:postId', async function(req, res, next) {
    try {
        // connect & check
        await client.connect();
        console.log("Connected to MongoDB on /deletePost");

        // delete post
        await deletePost(client, req.params.postId);

        // send deleted  message back
        res.send("post deleted");

    } catch (e) {
        console.error(e);
    } finally {
        // close connection
        await client.close();
    }
});

module.exports = router;
