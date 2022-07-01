import type { NextApiRequest, NextApiResponse } from 'next';
import { translateMediaType } from '../../../../../util';

type Data = {
  name: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { mediaTypeParam, externalId } = req.query;

  let mediaType;
  try {
    mediaType = translateMediaType(mediaTypeParam);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });

    return;
  }

  const baseUrl = process.env.BACKEND_BASE_URL;
  const key = process.env.BACKEND_API_KEY;

  const url = `${baseUrl}/${mediaType}/${externalId}/credits?api_key=${key}`;

  let credits = null;
  try {
    const response = await fetch(url);
    const data = await response.json();

    credits = {
      cast: data.cast,
      crew: data.crew,
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

  res.status(200).json(credits);
};
