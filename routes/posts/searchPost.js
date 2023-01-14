var express = require('express');
var router = express.Router();
const client = require('../../database/connection');

// find post in db
async function findPostsByTitle(client, title) {
  const result = await client.db("forum").collection("posts").findOne({title: title});

  if (result) {
    return(result);
  } else {
    return null;
  }
}

/* Send posts to view */
router.get('/:title', async function(req, res, next) {
  try {
    // connect & check
    await client.connect();
    console.log("Connected to MongoDB on /searchPost");

    // remove %20 from title
    let title = req.params.title;

    // get requested posts
    let posts = await findPostsByTitle(client, req.params.title);

    // send posts
    res.send(posts);

  } catch (e) {
      console.error(e);
  } finally {
      // close connection
      await client.close();
  }
});

module.exports = router;
