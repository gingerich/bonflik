const express = require('express');
const body = require('body-parser');
const movies = require('./algolia')('movies');

module.exports = express.Router()
  .use(body())

  .get('/search', (req, res) => {
    res.json([{
      title: 'Fake Movie',
      genre: ['fake'],
      actors: ['arnald schwartzenager'],
      release_year: 2001,
      poster_image: ''
    }]);
  })

  .get('/library/:id', (req, res) => {
    movies.getObject(req.params.id).then((result) => {
      res.json(result);
    }, (err) => {
      res.json(500, {
        error: err
      });
    });
  })

  .post('/library', (req, res) => {
    movies.addObject(req.body).then(() => {
      res.json(201, {});
    }, (err) => {
      res.json(500, {
        error: err
      });
    });
  });
