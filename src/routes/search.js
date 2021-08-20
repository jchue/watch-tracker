import express from 'express';
import axios from 'axios';
import HTTPError from '../error';

const debug = require('debug')('api:server');

const router = express.Router();

router.get(['/', '/:query'], async (req, res, next) => {
  const baseUrl = process.env.BACKEND_BASE_URL;
  const key = process.env.BACKEND_API_KEY;
  const { query } = req.params;
  const results = {
    movies: [],
    people: [],
    shows: [],
  };

  // If empty query, skip directly to empty response
  if (query) {
    const url = `${baseUrl}/search/multi`;
    const config = {
      params: {
        api_key: key,
        query,
      },
    };

    try {
      const response = await axios.get(url, config);
      response.data.results.forEach((result) => {
        if (result.media_type === 'tv') {
          results.shows.push(result);
        } else if (result.media_type === 'movie') {
          results.movies.push(result);
        } else if (result.media_type === 'person') {
          results.people.push(result);
        }
      });
    } catch (error) {
      // Output error to log
      debug(error.message);

      // Return generic server error
      return next(new HTTPError(500));
    }
  }

  res.data = results;
  debug(`Movies: ${results.movies.length}, People: ${results.people.length}, Shows: ${results.shows.length}`);

  return next();
});

export default router;
