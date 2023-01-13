var express = require('express');
var router = express.Router();

/* Send to about page */
router.get('/', function(req, res) {
    try {
        res.render('createPost', { title: 'New Post' });
    } catch (e) {
        console.error(e);
    }
});

module.exports = router;