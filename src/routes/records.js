import express from 'express';
import DB from '../db';

const debug = require('debug')('api:server');

const router = express.Router();

/**
 * GET
 */
router.get('/:mediaTypeParam/:externalId', (req, res, next) => {
  const db = new DB();

  /* Translate parameter to DB field */
  let mediaType;
  switch (req.params.mediaTypeParam) {
    case 'movie':
      mediaType = 'movie';
      break;
    case 'show':
      mediaType = 'tv';
      break;
    default: {
      const error = {
        statusCode: 404,
      };

      next(error);
      return;
    }
  }

  const query = 'SELECT * from tracked WHERE external_id = $externalId AND media_type = $mediaType';
  const params = {
    $externalId: req.params.externalId,
    $mediaType: mediaType,
  };

  db.get(query, params, (err, row) => {
    if (err) {
      /* DB error */
      debug(err.message);

      return next(err);
    }

    if (row) {
      const response = row;

      /* Convert values from SQLite */
      response.created = new Date(row.created * 1000);
      response.watched = row.watched === 1;
      response.watched_date = new Date(row.watched_date * 1000);

      debug(`GET /records/${req.params.externalId}`);

      res.data = response;

      db.close();

      return next();
    }

    /* Data not found */
    const error = {
      statusCode: 404,
    };

    db.close();

    return next(error);
  });
});

/**
 * POST
 */
router.post('/:mediaTypeParam/:externalId', (req, res, next) => {
  const db = new DB();

  /**
   * Initialize data
   */

  /* Translate parameter to DB field */
  let mediaType;
  switch (req.params.mediaTypeParam) {
    case 'movie':
      mediaType = 'movie';
      break;
    case 'show':
      mediaType = 'tv';
      break;
    default: {
      const error = {
        statusCode: 404,
      };

      next(error);
      return;
    }
  }

  const created = Date.now();
  const { externalId } = req.params;
  const watched = true;
  const watchedDate = Date.now();

  const query = 'INSERT OR REPLACE INTO tracked (created, media_type, external_id, watched, watched_date) values ($created, $mediaType, $externalId, $watched, $watchedDate)';

  /* Convert values for SQLite */
  const params = {
    $created: Math.floor(created / 1000),
    $mediaType: mediaType,
    $externalId: req.params.externalId,
    $watched: 1,
    $watchedDate: Math.floor(created / 1000),
  };

  db.run(query, params, function (err) {
    if (err) {
      debug(err.message);

      return next(err);
    }

    debug(`POST /records/${req.params.externalId}`);

    /* Return inserted data */
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

    db.close();

    return next();
  });
});

/**
 * DELETE
 */
router.delete('/:mediaTypeParam/:externalId', (req, res, next) => {
  /* Translate parameter to DB field */
  let mediaType;
  switch (req.params.mediaTypeParam) {
    case 'movie':
      mediaType = 'movie';
      break;
    case 'show':
      mediaType = 'tv';
      break;
    default: {
      const error = {
        statusCode: 404,
      };

      next(error);
      return;
    }
  }

  const query = 'DELETE FROM tracked WHERE external_id = $externalId AND media_type = $mediaType';
  const params = {
    $externalId: req.params.externalId,
    $mediaType: mediaType,
  };

  const db = new DB();

  db.run(query, params, (err) => {
    if (err) {
      debug(err.message);
    }

    debug(`DELETE /records/${req.params.externalId}`);

    res.sendStatus(204);
  });

  db.close();
});

export default router;
