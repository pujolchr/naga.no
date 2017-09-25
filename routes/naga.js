const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('naga', { page: 'content/naga.html' });
});

module.exports = router;
