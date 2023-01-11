var express = require('express');
var router = express.Router();
const client = require('../database/connection');

// find all posts function
async function findAllPosts(client) {
  const cursor = client.db("forum").collection("posts").find();

  const results = await cursor.toArray();

  if (results.length > 0) {
      return results;
  } else {
      return "No posts yet.";
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    // connect & check
    await client.connect();
    console.log("Connected to MongoDB on /");

    // get all posts
    let posts = await findAllPosts(client);

    // send posts to view
    res.render('index', { title: 'Forum', posts: posts });

} catch (e) {
    console.error(e);
} finally {
    // close connection
    await client.close();
}
});

module.exports = router;
