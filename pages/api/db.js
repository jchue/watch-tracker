import { Database } from 'sqlite3';

class DB extends Database {
  constructor() {
    super(process.env.SQLITE_DB_FILE, (error) => {
      if (error) {
        console.error(error.message);
      } else {
        console.log('Connected to database');
      }
    });
  }

  close() {
    console.log('Database closed');
    super.close();
  }
}

export default DB;
