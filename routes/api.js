const express = require('express');
const getRepo = require('../get-repos.js');
const fs = require('fs');
const cfg = require('../config/config.json');

const router = express.Router();

// get repo json
const fetchrepo = (owner) => 
  getRepo.getRepo(owner) // TODO supress this repo.user
    .then((data) => {
      console.log('try to save data'); // eslint-disable-line no-console
      return data;
    })
    .then((data) => {
      fs.writeFile(
        `data/${owner}.json`,
        JSON.stringify(data),
        (err) => {
          if (err) throw err;
          console.log(`The file '${owner}.json' has been saved!`); // eslint-disable-line no-console
        } // eslint-disable-line comma-dangle
      );
      return data;
    })
    .catch(data => console.log(data)); // eslint-disable-line no-console


/* GET home page. */
router.get('/refresh', (req, res, next) => {
  fetchrepo(cfg.owner).then(data => res.send(data));
});

module.exports = { router, fetchrepo };

