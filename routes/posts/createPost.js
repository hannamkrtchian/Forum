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

// create post in db
async function createPost(client, title, author, message) {
  const data = {
    title: title,
    author: author,
    message: message,
    date: currentDate
  }

  const valid = validate(data);

  if (!valid) {
    console.log(validate.errors);
  } else {
    const result = await client.db("forum").collection("posts").insertOne(data);
    return(result.insertedId);
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

/* Create post */
router.get('/:title/:author/:message', async function(req, res, next) {
    try {
      // connect & check
      await client.connect();
      console.log("Connected to MongoDB on /createPost");
  
      // create post
      const postId = await createPost(client, req.params.title, req.params.author, req.params.message);

      // get created post
      let post = await findPost(client, postId);
  
      // send view of created post
      res.render('details', { title: 'Details of post', post: post });
  
    } catch (e) {
        console.error(e);
    } finally {
        // close connection
        await client.close();
    }
});

module.exports = router;