#! /usr/bin/env nodejs
const fetch = require('node-fetch');

const apiUrl = 'api.github.com/users/pujolchr/repos';
const tok = '';
const repository = [];
const getRepos = url => fetch(url) // check for error?
  .then(data => data.json())
  .then((data) => {
    if (data.message) {
      console.log(data);
      return;
    }
    data.forEach((elmt) => {
      const repo = {};
      repo.name = elmt.name;
      repo.description = elmt.description;
      repo.html_url = elmt.html_url;
      repo.url = elmt.url;

      if (elmt.forks_count) repo.forks_count = elmt.forks_count;
      repository.push(repo);
    });
  })
  .then(() => Promise.all(repository.map((r) => {
    const repo = r;
    const rUrl = `https://pujolchr:${tok}@api.github.com/repos/pujolchr/${repo.name}`;
    return fetch(rUrl)
      .then(repoData => repoData.json())
      .then((repoData) => {
        repo.homepage = repoData.homepage;
        repo.languages_url = repoData.languages_url;
      });
  })))
  .then(() => Promise.all(repository.map((r) => {
    const repo = r;
    const rUrl = `https://pujolchr:${tok}@api.github.com/repos/pujolchr/${repo.name}/languages`;
    return fetch(rUrl)
      .then(lang => lang.json())
      .then((languages) => {
        repo.languages = Object.getOwnPropertyNames(languages);
      });
  })))
  .then(() => repository);


getRepos(`https://pujolchr:${tok}@${apiUrl}`).then(r => console.log(JSON.stringify(r)));
module.exports = getRepos;
