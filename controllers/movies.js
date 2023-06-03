const Movie = require('../models/movie');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../config/errors');
const {
  REMOVE_NOT_YOUR_MOVIE_MESSAGE,
  MOVIE_NOT_FOUD_MESSAGE,
  INCORRECT_ID_MESSAGE,
} = require('../config/errors/errors-messages');

const getMovies = (req, res, next) => {
  Movie.find()
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      movie.populate('owner')
        .then(() => res.status(201).send(movie));
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const message = Object.values(e.errors).map((error) => error.message).join('; ');
        next(new BadRequestError(message));
      } else {
        next(e);
      }
    });
};

const removeMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail()
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(REMOVE_NOT_YOUR_MOVIE_MESSAGE);
      }
      return movie.deleteOne()
        .then(() => {
          movie.populate('owner')
            .then(() => res.send(movie));
        });
    })
    .catch((e) => {
      if (e.name === 'DocumentNotFoundError') {
        next(new NotFoundError(MOVIE_NOT_FOUD_MESSAGE));
      } else if (e.name === 'CastError') {
        next(new BadRequestError(INCORRECT_ID_MESSAGE));
      } else {
        next(e);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  removeMovie,
};
