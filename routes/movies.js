const movieRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { movieSchema, movieIdSchema } = require('../middlewares/movie-validation');
const {
  getMovies,
  createMovie,
  removeMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', celebrate({ body: movieSchema }), createMovie);
movieRouter.delete('/:_id', celebrate({ params: movieIdSchema }), removeMovie);

module.exports = movieRouter;
