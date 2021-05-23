import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';

const app = express();

const db = new sqlite3.Database(process.env.SQLITE_DB_FILE, (error) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log('Connected to the database.');
  }
});

app.use(cors());
app.use(bodyParser.json());

app.get('/records/:externalId', (req, res) => {
  const query = 'SELECT * from tracked WHERE external_id = $externalId';
  const params = {
    $externalId: req.params.externalId,
  };

  db.get(query, params, (err, row) => {
    if (err) {
      console.error(err.message);
    }

    if (row) {
      const response = row;
      response.created = new Date(row.created * 1000); // Convert to date
      response.watched = row.watched === 1; // Convert to boolean
      response.watched_date = new Date(row.watched_date * 1000); // Convert to date

      res.send(response);
    } else {
      res.sendStatus(404);
    }
  });
});

app.post('/records/:externalId', (req, res) => {
  if (!req.body.mediaType) {
    res.status(400).send('mediaType required');
  } else {
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
        console.error(err.message);
      }

      res.sendStatus(201);
    });
  }
});

app.delete('/records/:externalId', (req, res) => {
  const query = 'DELETE FROM tracked WHERE external_id = $externalId';
  const params = {
    $externalId: req.params.externalId,
  };

  db.run(query, params, (err) => {
    if (err) {
      console.error(err.message);
    }

    res.sendStatus(204);
  });
});

// db.close();

module.exports = app;