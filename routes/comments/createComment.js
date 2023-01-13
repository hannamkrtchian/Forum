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
    postId: {type: "string"},
    author: {type: "string"},
    message: {type: "string"},
    date: {type: "string"}
  },
  optionalProperties: {
  }
}

const validate = ajv.compile(schema);

// get date
let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = ("0"+date_ob.getMinutes()).slice(-2);

// current seconds
let seconds = date_ob.getSeconds();

// stores date & time in DD/MM/YYYY HH:MM:SS format
let currentDate = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;

// create comment in db
async function createComment(client, author, message, postId) {
  const data = {
    postId: postId,
    author: author,
    message: message,
    date: currentDate
  }

  const valid = validate(data);

  if (!valid) {
    console.log(validate.errors);
  } else {
    await client.db("forum").collection("comments").insertOne(data);
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

/* Create comment */
router.get('/:postId/:author/:message', async function(req, res, next) {
    try {
      // connect & check
      await client.connect();
      console.log("Connected to MongoDB on /createComment");
  
      // create comment
      await createComment(client, req.params.author, req.params.message, req.params.postId);

      // get post
      let post = await findPost(client, req.params.postId);

      // get comments
      let comments = await findComments(client, req.params.postId);
  
      // send view of post with comments
      res.render('details', { title: 'Details of post', post: post, comments: comments });
  
    } catch (e) {
        console.error(e);
    } finally {
        // close connection
        await client.close();
    }
});

module.exports = router;