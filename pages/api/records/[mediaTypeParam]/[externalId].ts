import type { NextApiRequest, NextApiResponse } from 'next';
import { translateMediaType } from '../../../../util';
import DB from '../../db';

type Data = {
  name: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const {
    query: { mediaTypeParam, externalId },
    method,
  } = req;

  /**
   * GET
   */
  if (method === 'GET') {
    const mediaType = translateMediaType(mediaTypeParam);

    // Prepare bind parameters for SQL
    const params = {
      $externalId: Number(externalId),
      $mediaType: mediaType,
    };
    const query = 'SELECT * from tracked WHERE external_id = $externalId AND media_type = $mediaType';

    const db = new DB();
    db.get(query, params, (err, row) => {
      // DB error
      if (err) {
        // Output error to log
        console.error(err.message);

        // Return generic server error
        res.status(500).json({ error: 'Internal Server Error' });

        return;
      }

      // Data found
      if (row) {
        // Convert values from SQLite
        const data = {
          id: row.id,
          created: new Date(row.created * 1000),
          media_type: row.media_type,
          external_id: row.external_id,
          watched: row.watched === 1,
          watched_date: new Date(row.watched_date * 1000),
        };

        console.log('Record found: %o', data);

        db.close();

        res.status(200).json(data);

        return;
      }

      // Data not found; send not watched by default
      const data = {
        id: externalId,
        watched: false,
      };

      console.log('Record not found: %o', data);

      db.close();
    
      return;
    });
  }

  /**
   * POST
   */
  if (method === 'POST') {
    // Initialize data
    const mediaType = translateMediaType(mediaTypeParam);
    const created = new Date();
    const watched = true;
    const watchedDate = new Date();

    // Convert values for SQLite and prepare bind parameters
    const params = {
      $created: Math.floor(created.getTime() / 1000),
      $mediaType: mediaType,
      $externalId: Number(externalId),
      $watched: 1,
      $watchedDate: Math.floor(created.getTime() / 1000),
    };
    const query = 'INSERT OR REPLACE INTO tracked (created, media_type, external_id, watched, watched_date) values ($created, $mediaType, $externalId, $watched, $watchedDate)';

    const db = new DB();
    db.run(query, params, function callback(err) {
      if (err) {
        // Output error to log
        console.error(err.message);

        // Return generic server error
        res.status(500).json({ error: 'Internal Server Error' });

        return;
      }

      // Return inserted data
      const data = {
        id: this.lastID,
        created,
        media_type: mediaType,
        external_id: externalId,
        watched,
        watched_date: watchedDate,
      };

      console.log('Record created: %o', data);

      db.close();
      
      res.status(201).json(data);

      return;
    });
  }

  /**
   * DELETE
   */
  if (method === 'DELETE') {
    const mediaType = translateMediaType(mediaTypeParam);

    // Prepare bind parameters for SQL
    const params = {
      $externalId: externalId,
      $mediaType: mediaType,
    };
    const query = 'DELETE FROM tracked WHERE external_id = $externalId AND media_type = $mediaType';
  
    const db = new DB();
    db.run(query, params, function callback(err) {
      if (err) {
        // Output error to log
        console.error(err.message);
  
        // Return generic server error
        res.status(500).json({ error: 'Internal Server Error' });

        return;
      }
  
      // Output result to log, but return idempotent 204 regardless
      if (this.changes) {
        const data = {
          external_id: Number(externalId),
          media_type: mediaType,
        };
        console.log('Record deleted: %o', data);
      } else {
        console.log(`No record of '${mediaType}' with external ID ${externalId} found`);
      }
  
      db.close();
      
      res.status(204).send();

      return;
    });
  }
};
