var express = require('express');
var router = express.Router();
const client = require('../../database/connection');

// id's in mongoDB
var ObjectId = require('mongodb').ObjectId

async function deleteComment(client, commentId) {
    await client.db("forum").collection("comments").deleteOne({ '_id': ObjectId(commentId) });
}

/* Delete comment */
router.get('/:commentId', async function(req, res, next) {
    try {
        // connect & check
        await client.connect();
        console.log("Connected to MongoDB on /deleteComment");

        // delete comment
        await deleteComment(client, req.params.commentId);

        // send deleted message back
        res.send("comment deleted");

    } catch (e) {
        console.error(e);
    } finally {
        // close connection
        await client.close();
    }
});

module.exports = router;
