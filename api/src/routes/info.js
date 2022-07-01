import express from 'express';
import axios from 'axios';
import HTTPError from '../error';
import { translateMediaType } from '../util';

const debug = require('debug')('api:server');

const router = express.Router();

router.get('/:mediaTypeParam/:externalId', async (req, res, next) => {
  let mediaType;
  try {
    mediaType = translateMediaType(req.params.mediaTypeParam);
  } catch (error) {
    next(error);
  }

  const baseUrl = process.env.BACKEND_BASE_URL;
  const key = process.env.BACKEND_API_KEY;

  const url = `${baseUrl}/${mediaType}/${req.params.externalId}`;
  const config = {
    params: {
      api_key: key,
    },
  };

  try {
    const response = await axios.get(url, config);
    res.data = {
      genres: response.data.genres,
      homepage: response.data.homepage,
      overview: response.data.overview,
      poster_path: response.data.poster_path,
      vote_average: response.data.vote_average,
      title: response.data.title || response.data.name, // Distill both movie title and show name to title
    };
    if (mediaType === 'tv') {
      res.data.seasons = response.data.seasons;
    }
  } catch (error) {
    // Output error to log
    debug(error.message);

    // If not found in backend, return 404
    if (error.response.status === 404) {
      return next(new HTTPError(404));
    }

    // Else return generic server error
    return next(new HTTPError(500));
  }

  return next();
});

router.get('/:mediaTypeParam/:externalId/credits', async (req, res, next) => {
  let mediaType;
  try {
    mediaType = translateMediaType(req.params.mediaTypeParam);
  } catch (error) {
    next(error);
  }

  const baseUrl = process.env.BACKEND_BASE_URL;
  const key = process.env.BACKEND_API_KEY;

  const url = `${baseUrl}/${mediaType}/${req.params.externalId}/credits`;
  const config = {
    params: {
      api_key: key,
    },
  };

  try {
    const response = await axios.get(url, config);
    res.data = {
      cast: response.data.cast,
      crew: response.data.crew,
    };
  } catch (error) {
    // Output error to log
    debug(error.message);

    // If not found in backend, return 404
    if (error.response.status === 404) {
      return next(new HTTPError(404));
    }

    // Else return generic server error
    return next(new HTTPError(500));
  }

  return next();
});

router.get('/show/:externalId/season/:seasonNumber', async (req, res, next) => {
  const baseUrl = process.env.BACKEND_BASE_URL;
  const key = process.env.BACKEND_API_KEY;

  // If empty query, skip directly to empty response
  if (req.params.externalId) {
    const url = `${baseUrl}/tv/${req.params.externalId}/season/${req.params.seasonNumber}`;
    const config = {
      params: {
        api_key: key,
      },
    };

    try {
      const response = await axios.get(url, config);
      res.data = {
        name: response.data.name,
        overview: response.data.overview,
        poster_path: response.data.poster_path,
        air_date: response.data.air_date,
        episodes: response.data.episodes,
      };
    } catch (error) {
      // Output error to log
      debug(error.message);

      // If not found in backend, return 404
      if (error.response.status === 404) {
        return next(new HTTPError(404));
      }

      // Else return generic server error
      return next(new HTTPError(500));
    }
  }

  return next();
});

export default router;
