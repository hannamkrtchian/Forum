var express = require('express');
var router = express.Router();

/* Send to about page */
router.get('/', function(req, res) {
    try {
        res.render('about', { title: 'About' });
    } catch (e) {
        console.error(e);
    }
});

module.exports = router;