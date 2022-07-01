import express from 'express';
import DB from '../db';
import HTTPError from '../error';
import { translateMediaType } from '../util';

const debug = require('debug')('api:server');

const router = express.Router();

/**
 * GET
 */
router.get('/:mediaTypeParam/:externalId', (req, res, next) => {
  const mediaType = translateMediaType(req.params.mediaTypeParam);
  const externalId = Number(req.params.externalId);

  // Prepare bind parameters for SQL
  const params = {
    $externalId: externalId,
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
      res.data = data;
      debug('Record found: %o', data);

      db.close();
      return next();
    }

    // Data not found; send not watched by default
    const data = {
      id: externalId,
      watched: false,
    };
    res.data = data;
    debug('Record not found: %o', data);

    db.close();
    return next();
  });
});

/**
 * POST
 */
router.post('/:mediaTypeParam/:externalId', (req, res, next) => {
  // Initialize data
  const mediaType = translateMediaType(req.params.mediaTypeParam);
  const created = new Date();
  const externalId = Number(req.params.externalId);
  const watched = true;
  const watchedDate = new Date();

  // Convert values for SQLite and prepare bind parameters
  const params = {
    $created: Math.floor(created.getTime() / 1000),
    $mediaType: mediaType,
    $externalId: req.params.externalId,
    $watched: 1,
    $watchedDate: Math.floor(created.getTime() / 1000),
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
      created,
      media_type: mediaType,
      external_id: externalId,
      watched,
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

    // Output result to log, but return idempotent 204 regardless
    if (this.changes) {
      const data = {
        external_id: Number(req.params.externalId),
        media_type: mediaType,
      };
      debug('Record deleted: %o', data);
    } else {
      debug(`No record of '${mediaType}' with external ID ${req.params.externalId} found`);
    }
    res.statusCode = 204;

    db.close();
    return next();
  });
});

export default router;
