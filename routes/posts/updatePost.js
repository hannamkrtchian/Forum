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
    title: {type: "string"},
    author: {type: "string"},
    message: {type: "string"}
  },
  optionalProperties: {
  }
}

const validate = ajv.compile(schema);

// update post in db
async function updatePost(client, postId, title, author, message) {
  const data = {
    title: title,
    author: author,
    message: message
  }

  const valid = validate(data);

  if (!valid) {
    console.log(validate.errors);
  } else {
    await client.db("forum").collection("posts").updateOne({ '_id': ObjectId(postId) },
    { $set: {title: data.title, author: data.author, message: data.message}});
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

/* Update post */
router.get('/:postId/:title/:author/:message', async function(req, res, next) {
    try {
      // connect & check
      await client.connect();
      console.log("Connected to MongoDB on /updatePost");
  
      // update post
      await updatePost(client, req.params.postId, req.params.title, req.params.author, req.params.message);
  
      // find updated post
      let post = await findPost(client, req.params.postId);

      // send updated message back
      res.render('details', { title: 'Details of post', post: post });
  
    } catch (e) {
        console.error(e);
    } finally {
        // close connection
        await client.close();
    }
});

module.exports = router;