import express from 'express';

const app = express();
const media = [
  {
    id: 0,
    media_type: 'tv',
    external_id: 1234,
    watched: false,
    watched_date: null,
  },
  {
    id: 1,
    media_type: 'movie',
    external_id: 5678,
    watched: false,
    watched_date: null,
  },
];

app.listen(3000, () => console.log('Server listening on port 3000'));

app.get(['/shows/:externalId', '/shows/*/seasons/*/episodes/:externalId'], (req, res) => {
  let found = false;

  media.forEach((item) => {
    if (item.external_id === parseInt(req.params.externalId, 10)) {
      found = true;
      res.send(item);
    }
  });

  if (!found) {
    res.sendStatus(404);
  }
});
