import express from 'express';
import axios from 'axios';

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

  /* If empty query, skip directly to empty response */
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
      next(error);
    }
  }

  res.data = results;
  next();
});

export default router;
