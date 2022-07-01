import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const baseUrl = process.env.BACKEND_BASE_URL;
  const key = process.env.BACKEND_API_KEY;
  const { query } = req.query;
  const results = {
    movies: [],
    people: [],
    shows: [],
  };

  // If empty query, skip directly to empty response
  if (query) {
    const url = `${baseUrl}/search/multi?api_key=${key}&query=${query}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      data.results.forEach((result) => {
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
      console.error(error.message);

      // Return generic server error
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  console.log(`Movies: ${results.movies.length}, People: ${results.people.length}, Shows: ${results.shows.length}`);

  res.status(200).json(results);
}
