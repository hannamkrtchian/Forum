var express = require('express');
var router = express.Router();
const client = require('../../database/connection');

// id's in mongoDB
var ObjectId = require('mongodb').ObjectId

/* Delete post */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
