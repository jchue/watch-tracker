import express from 'express';
import DB from '../db';
import HTTPError from '../error';

const debug = require('debug')('api:server');

const router = express.Router();

/**
 * Translate media type parameter to DB field
 */
function translateMediaType(mediaTypeParam) {
  let mediaType;
  switch (mediaTypeParam) {
    case 'movie':
      mediaType = 'movie';
      break;
    case 'show':
      mediaType = 'tv';
      break;
    default: {
      debug(`Invalid media type URL parameter '${mediaTypeParam}'`);
      throw new HTTPError(404);
    }
  }

  return mediaType;
}

/**
 * GET
 */
router.get('/:mediaTypeParam/:externalId', (req, res, next) => {
  debug(`${req.method} ${req.originalUrl}`);

  const mediaType = translateMediaType(req.params.mediaTypeParam);

  // Prepare bind parameters for SQL
  const params = {
    $externalId: req.params.externalId,
    $mediaType: mediaType,
  };
  const query = 'SELECT * from tracked WHERE external_id = $externalId AND media_type = $mediaType';

  const db = new DB();
  db.get(query, params, (err, row) => {
    // DB error
    if (err) {
      // Output error to log
      debug(err.message);

      // Return generic server error
      return next(new HTTPError(500));
    }

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
      res.data = data;
      debug('Record found: %o', data);

      db.close();
      return next();
    }

    db.close();

    // Data not found
    debug('Record not found');
    return next(new HTTPError(404));
  });
});

/**
 * POST
 */
router.post('/:mediaTypeParam/:externalId', (req, res, next) => {
  debug(`${req.method} ${req.originalUrl}`);

  /**
   * Initialize data
   */
  const mediaType = translateMediaType(req.params.mediaTypeParam);
  const created = Date.now();
  const { externalId } = req.params;
  const watched = true;
  const watchedDate = Date.now();

  // Convert values for SQLite and prepare bind parameters
  const params = {
    $created: Math.floor(created / 1000),
    $mediaType: mediaType,
    $externalId: req.params.externalId,
    $watched: 1,
    $watchedDate: Math.floor(created / 1000),
  };
  const query = 'INSERT OR REPLACE INTO tracked (created, media_type, external_id, watched, watched_date) values ($created, $mediaType, $externalId, $watched, $watchedDate)';

  const db = new DB();
  db.run(query, params, function callback(err) {
    if (err) {
      // Output error to log
      debug(err.message);

      // Return generic server error
      return next(new HTTPError(500));
    }

    // Return inserted data
    const data = {
      id: this.lastID,
      created: new Date(created),
      media_type: mediaType,
      external_id: externalId,
      watched: new Date(watched),
      watched_date: watchedDate,
    };
    res.data = data;
    res.statusCode = 201;
    debug('Record created: %o', data);

    db.close();
    return next();
  });
});

/**
 * DELETE
 */
router.delete('/:mediaTypeParam/:externalId', (req, res, next) => {
  debug(`${req.method} ${req.originalUrl}`);

  const mediaType = translateMediaType(req.params.mediaTypeParam);

  // Prepare bind parameters for SQL
  const params = {
    $externalId: req.params.externalId,
    $mediaType: mediaType,
  };
  const query = 'DELETE FROM tracked WHERE external_id = $externalId AND media_type = $mediaType';

  const db = new DB();
  db.run(query, params, function callback(err) {
    if (err) {
      // Output error to log
      debug(err.message);

      // Return generic server error
      return next(new HTTPError(500));
    }

    // Output result ot log, but return idempotent 204 regardless
    res.statusCode = 204;
    debug(this.changes ? `Record of '${mediaType}' with external ID ${req.params.externalId} deleted` : `No record of '${mediaType}' with external ID ${req.params.externalId} found`);

    db.close();
    return next();
  });
});

export default router;
