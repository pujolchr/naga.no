#! /usr/bin/env node

const fetch = require('node-fetch');
const {
  APIurl,
  tok,
  user,
  owner,
} = require('./config/config.js');

const repository = [];
const getRepos = url => fetch(url) // check for error?
  .then(data => data.json())
  .then((data) => {
    if (data.message) {
      return Promise.reject(data);
    }
    data.forEach((elmt) => {
      const repo = {};
      repo.name = elmt.name;
      repo.description = elmt.description;
      repo.html_url = elmt.html_url;
      repo.url = elmt.url;

      if (elmt.forks) repo.forks = elmt.forks;
      repository.push(repo);
    });
    return repository;
  })
  .then(() => Promise.all(repository.map((r) => {
    const repo = r;
    const rUrl = `https://${user}:${tok}@${APIurl}/repos/${owner}/${repo.name}`;
    return fetch(rUrl)
      .then(repoData => repoData.json())
      .then((repoData) => {
        repo.homepage = repoData.homepage;
        repo.languages_url = repoData.languages_url;
      });
  })))
  .then(() => Promise.all(repository.map((r) => {
    const repo = r;
    const rUrl = `https://${user}:${tok}@${APIurl}/repos/${owner}/${repo.name}/languages`;
    return fetch(rUrl)
      .then(lang => lang.json())
      .then((languages) => {
        repo.languages = Object.getOwnPropertyNames(languages);
      });
  })))
  .then(() => repository);

if (require.main === module) {
  getRepos(`https://${user}:${tok}@${APIurl}/users/${owner}/repos`)
    .then(r => console.log(JSON.stringify(r))) // eslint-disable-line no-console
    .catch(data => console.log(data)); // eslint-disable-line no-console
} else {
  module.exports = getRepos;
}
