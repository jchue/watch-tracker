import express from 'express';
import cors from 'cors';
import DB from './db';

const debug = require('debug')('api:server');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/records/:externalId', async (req, res) => {
  const db = new DB();

  const query = 'SELECT * from tracked WHERE external_id = $externalId';
  const params = {
    $externalId: req.params.externalId,
  };

  db.get(query, params, (err, row) => {
    if (err) {
      debug(err.message);
    }

    if (row) {
      const response = row;
      response.created = new Date(row.created * 1000); // Convert to date
      response.watched = row.watched === 1; // Convert to boolean
      response.watched_date = new Date(row.watched_date * 1000); // Convert to date

      debug(`GET /records/${req.params.externalId}`);

      res.send(response);
    } else {
      res.sendStatus(404);
    }
  });

  db.close();
});

app.post('/records/:externalId', (req, res) => {
  if (!req.body.mediaType) {
    res.status(400).send('mediaType required');
  } else {
    const db = new DB();

    const query = 'INSERT OR REPLACE INTO tracked (created, media_type, external_id, watched, watched_date) values ($created, $mediaType, $externalId, $watched, $watchedDate)';
    const params = {
      $created: Math.floor(Date.now() / 1000),
      $mediaType: req.body.mediaType,
      $externalId: req.params.externalId,
      $watched: 1,
      $watchedDate: Math.floor(Date.now() / 1000),
    };

    db.run(query, params, (err) => {
      if (err) {
        debug(err.message);
      }

      debug(`POST /records/${req.params.externalId}`);

      res.sendStatus(201);
    });

    db.close();
  }
});

app.delete('/records/:externalId', (req, res) => {
  const query = 'DELETE FROM tracked WHERE external_id = $externalId';
  const params = {
    $externalId: req.params.externalId,
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

module.exports = app;
