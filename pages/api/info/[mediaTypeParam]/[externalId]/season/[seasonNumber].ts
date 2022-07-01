import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { mediaTypeParam, externalId, seasonNumber } = req.query;

  const baseUrl = process.env.BACKEND_BASE_URL;
  const key = process.env.BACKEND_API_KEY;

  // If empty query, skip directly to empty response
  if (mediaTypeParam === 'shows' && externalId) {
    const url = `${baseUrl}/tv/${externalId}/season/${seasonNumber}?api_key=${key}`;

    let season = null;
    try {
      const response = await fetch(url);
      const data = await response.json();

      season = {
        name: data.name,
        overview: data.overview,
        poster_path: data.poster_path,
        air_date: data.air_date,
        episodes: data.episodes,
      };
    } catch (error) {
      // Output error to log
      console.error(error.message);

      // If not found in backend, return 404
      if (error.response.status === 404) {
        res.status(404).json({ error: 'Not Found' });

        return;
      }

      // Else return generic server error
      res.status(500).json({ error: 'Internal Server Error' });

      return;
    }

    res.status(200).json(season);
  }
};
