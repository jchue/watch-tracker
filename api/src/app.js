import express from 'express';
import cors from 'cors';
import HTTPError from './error';
import searchRouter from './routes/search';
import infoRouter from './routes/info';
import recordsRouter from './routes/records';

const app = express();
const debug = require('debug')('api:server');

app.use(cors());
app.use(express.json());

/* Log request */
app.use((req, res, next) => {
  debug(`${req.method} ${req.originalUrl}`);

  return next();
});

app.use('/search', searchRouter);
app.use('/info', infoRouter);
app.use('/records', recordsRouter);

/* Standardize response structure */
app.use((req, res, next) => {
  // 404 if data is expected but not returned
  if (!res.data && res.statusCode !== 204) {
    return next(new HTTPError(404));
  }

  res.statusCode = res.statusCode || 200;
  res.body = {
    data: res.data,
  };

  return res.status(res.statusCode).json(res.body);
});

/* Error handler */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.statusCode = err.statusCode || 500;
  res.title = '';

  switch (res.statusCode) {
    case 404:
      res.title = 'Not Found';
      break;
    default:
      res.title = 'Internal Server Error';
  }

  res.body = {
    errors: [{
      status: res.statusCode.toString(),
      title: res.title,
      detail: err.message,
    }],
  };

  return res.status(res.statusCode).json(res.body);
});

module.exports = app;
