const express = require('express');
const fs = require('fs');
const path = require('path');
const cfg = require('../config/config.json');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  fs.readFile(path.join('data', `${cfg.user}.json`), (err, data) => {
    if (err) {
      return next(err);
    }
    res.render('portfolio', { repos: JSON.parse(data) });
  });
});

module.exports = router;
