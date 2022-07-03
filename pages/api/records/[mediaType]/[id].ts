import type { NextApiRequest, NextApiResponse } from 'next';
import DB from './db';

type Data = {
  name: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const {
    query: { mediaType, id },
    method,
  } = req;

  /**
   * Translate media type parameter to DB field
   */
  function translateMediaType(mediaType) {
    switch (mediaType) {
      case 'movies':
        return 'movie';
      case 'shows':
        return 'tv';
      default: {
        console.error(`Invalid media type URL parameter '${mediaType}'`);
        throw new Error('Not Found');
      }
    }
  }

  /**
   * GET
   */
  if (method === 'GET') {
    // Prepare bind parameters for SQL
    const params = {
      $id: Number(id),
      $mediaType: translateMediaType(mediaType),
    };
    const query = 'SELECT * from tracked WHERE external_id = $id AND media_type = $mediaType';

    const db = new DB();

    try {
      db.get(query, params, (error, row) => {
        // DB error
        if (error) throw error;

        // Data found
        if (row) {
          // Convert values from SQLite
          const data = {
            id: row.external_id,
            mediaType: row.media_type,
            watched: row.watched === 1,
            watchedDate: new Date(row.watched_date * 1000),
          };

          console.log('Record found: %o', data);

          res.status(200).json(data);
          return;
        }

        // Data not found; send not watched by default
        const data = {
          id,
          watched: false,
        };

        console.log('Record not found: %o', data);

        res.status(200).json(data);
    
        return;
      });
    } catch (error) {
      // Output error to log
      console.error(error.message);

      // Return generic server error
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    } finally {
      db.close();
    }
  }

  /**
   * POST
   */
  if (method === 'POST') {
    // Initialize data
    const created = new Date();
    const watched = true;
    const watchedDate = new Date();

    // Convert values for SQLite and prepare bind parameters
    const params = {
      $id: Number(id),
      $created: Math.floor(created.getTime() / 1000),
      $mediaType: translateMediaType(mediaType),
      $watched: 1,
      $watchedDate: Math.floor(created.getTime() / 1000),
    };
    const query = 'INSERT OR REPLACE INTO tracked (created, media_type, external_id, watched, watched_date) values ($created, $mediaType, $id, $watched, $watchedDate)';

    const db = new DB();

    try {
      db.run(query, params, function callback(error) {
        if (error) throw error;

        // Return inserted data
        const data = {
          id,
          mediaType,
          watched,
          watchedDate,
        };

        console.log('Record created: %o', data);

        res.status(201).json(data);
        return;
      });
    } catch (error) {
      // Output error to log
      console.error(error.message);

      // Return generic server error
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    } finally {
      db.close();
    }
  }

  /**
   * DELETE
   */
  if (method === 'DELETE') {
    // Prepare bind parameters for SQL
    const params = {
      $id: Number(id),
      $mediaType: translateMediaType(mediaType),
    };
    const query = 'DELETE FROM tracked WHERE external_id = $id AND media_type = $mediaType';
  
    const db = new DB();

    try {
      db.run(query, params, function callback(error) {
        if (error) throw error;

        // Output result to log, but return idempotent 204 regardless
        if (this.changes) {
          const data = {
            id: Number(id),
            mediaType,
          };

          console.log('Record deleted: %o', data);
        } else {
          console.log(`No record of '${mediaType}' with external ID ${id} found`);
        }

        res.status(204).send();
        return;
      });
    } catch (error) {
      // Output error to log
      console.error(error.message);
  
      // Return generic server error
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    } finally {
      db.close();
    }
  }
};
