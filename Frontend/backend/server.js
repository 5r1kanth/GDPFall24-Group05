const express = require('express');
const db = require('./databaseConnection.js');
const dotenv = require('dotenv').config();
const path=require('path');

const userRoutes = require('./Routers/userRoutes.js');
const adminRoutes = require('./Routers/adminRoutes.js');
const instructorRoutes = require('./Routers/instructorRoutes.js');

const publicPath = path.join(__dirname,'../public');
const adminPath = path.join(__dirname, '../admin');
const instructorPath = path.join(__dirname, '../instructor');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.use(express.static(publicPath));
app.use('/instructor', express.static(instructorPath));
app.use('/admin', express.static(adminPath));

app.use('/user', userRoutes);
app.use('/instructor', instructorRoutes);
app.use('/admin', adminRoutes);


app.get('/test', async (req, res) => {
    res.status(200).json({ msg : "Server running " });
});


const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const gracefulShutdown = async () => {
  console.log('\nShutting down gracefully...');
  try {
    await db.close();
    console.log('Database connection closed.');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});
