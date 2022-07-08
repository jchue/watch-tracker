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
    const url = `${baseUrl}/search/multi?api_key=${key}&query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      data.results.forEach((result) => {
        if (result.media_type === 'tv') {
          results.shows.push({
            id: result.id,
            title: result.name,
            startDate: result.first_air_date,
          });
        } else if (result.media_type === 'movie') {
          results.movies.push({
            id: result.id,
            title: result.title,
            date: result.release_date,
          });
        } else if (result.media_type === 'person') {
          results.people.push(result);
        }
      });
    } catch (error) {
      // Output error to log
      console.error(error.message);

      // Return generic server error
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  }

  console.log(`Movies: ${results.movies.length}, People: ${results.people.length}, Shows: ${results.shows.length}`);

  res.status(200).json(results);
  return;
};
