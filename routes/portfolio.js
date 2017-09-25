const express = require('express');
const myrepos = require('../pujolchr.json');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('portfolio', { repos: myrepos });
});

module.exports = router;
