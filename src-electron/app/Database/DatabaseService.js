const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseService {
  constructor() {
    this.knex = require('knex')({
      client: 'sqlite3',
      connection: {
        filename: path.join(global.appDataDir, 'myapp.db'),
      },
    });
    this.db = DatabaseService.getDatabase(global.appDataDir);
  }

  async initDatabase() {
    if (!await this.knex.schema.hasTable('events')) {
      await this.knex.schema.createTable('events', (table) => {
        table.increments('id');
        table.string('plate').notNullable();
        table.integer('date');
        table.string('camera').notNullable();
      });
    }
    if (!await this.knex.schema.hasTable('alerts')) {
      await this.knex.schema.createTable('alerts', (table) => {
        table.increments('id');
        table.string('type').notNullable();
        table.string('address').notNullable();
      });
    }
  }

  static getDatabase(appDataDir) {
    return new sqlite3.Database(path.join(appDataDir, 'myapp.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the chinook database.');
    });
  }
}
export default DatabaseService;
