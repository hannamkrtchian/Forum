const express = require('express');
const app = express();
const client = require('./server/dbConfig');
var ObjectId = require('mongodb').ObjectId

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        /* await createPost(client, {
            author: "Someone else",
            message: "Second message.", 
            date: Date()
        }); */

        await findOnePostByName(client, "Someone");
        await findOnePostByName(client, "iek");

        // await findAllPosts(client);

        // await updatePostById(client, '63b5c9b8dfa9d881eea76199', {message: "Third message."});

        await deletePostById(client, '63b5c9b8dfa9d881eea76199');

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

// create operation
async function createPost(client, newPost) {
    const result = await client.db("forum").collection("posts").insertOne(newPost);

    console.log(result.insertedId);
}

// read operations
async function findOnePostByName(client, authorOfPost) {
    const result = await client.db("forum").collection("posts").findOne({author: authorOfPost});

    if (result) {
        console.log(result);
    } else {
        console.log("not found");
    }
}

async function findAllPosts(client) {
    const cursor = client.db("forum").collection("posts").find();

    const results = await cursor.toArray();

    if (results.length > 0) {
        results.forEach((result, i) => {
            console.log();
            console.log(`${i+1}. Author: ${result.author}`);
            console.log(`    Message: ${result.message}`);
            console.log(`    Date: ${result.date}`);
        })
    } else {
        console.log("No posts yet.");
    }
}

// update functions
async function updatePostById(client, postId, updatedPost) {
    const result = await client.db("forum").collection("posts").updateOne({ '_id': ObjectId(postId) },
        { $set: updatedPost });

    console.log(result.matchedCount);
    console.log(result.modifiedCount);
}

// delete functions
async function deletePostById(client, postId) {
    const result = await client.db("forum").collection("posts").deleteOne({ '_id': ObjectId(postId) });

    console.log(result.deletedCount);
}

app.listen(5500, () => console.log('Server started: http://localhost:5500'));
