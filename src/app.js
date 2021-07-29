import express from 'express';
import cors from 'cors';
import searchRouter from './routes/search';
import recordsRouter from './routes/records';

const debug = require('debug')('api:server');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/search', searchRouter);
app.use('/records', recordsRouter);

/* Standardize response structure */
app.use((req, res, next) => {
  if (!res.data) {
    const error = {
      statusCode: 404,
      detail: `Requested resource at ${req.originalUrl} not found`,
    };

    debug(error);
    return next(error); // Pass error to next middleware
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
