import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();

app.use(cors());
app.listen(3000, () => console.log('Server listening on port 3000'));

app.get(['/shows/:externalId', '/shows/*/seasons/*/episodes/:externalId'], (req, res) => {
  const db = new sqlite3.Database(process.env.SQLITE_DB_FILE, (error) => {
    if (error) {
      console.log(error.message);
    } else {
      console.log('Connected to the database.');
    }
  });

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
  db.close();
});
