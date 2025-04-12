const mysql = require('mysql2');
const fs = require('fs');
const dotenv = require('dotenv').config();

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 100,
      queueLimit: 0,
      ssl: {
        minVersion: 'TLSv1.2',
        ca: fs.readFileSync('./backend/ssl.pem'),
      },
    }).promise();
  }

  // Execute a single query
  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  // Execute a single query (alternative method)
  async execute(sql, params = []) {
    const rows = await this.pool.execute(sql, params);
    return rows;
  }

 
  async beginTransaction() {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    return connection;
  }

  async commitTransaction(connection) {
    await connection.commit();
    connection.release();
  }

  async rollbackTransaction(connection) {
    await connection.rollback();
    connection.release();
  }

  async close() {
    await this.pool.end();
  }
}

const db = new Database();
module.exports = db;
