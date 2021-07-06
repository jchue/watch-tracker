import 'dotenv/config';
import { Database } from 'sqlite3';

const debug = require('debug')('api:server');

class DB extends Database {
  constructor() {
    super(process.env.SQLITE_DB_FILE, (error) => {
      if (error) {
        debug(error.message);
      } else {
        debug('Connected to database');
      }
    });
  }

  close() {
    debug('Database closed');
    super.close();
  }
}

export default DB;