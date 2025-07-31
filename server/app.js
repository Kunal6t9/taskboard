const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const listRoutes = require('./routes/listRoutes');
const cardRoutes = require('./routes/cardRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Connect routes
app.use('/lists', listRoutes);
app.use('/cards', cardRoutes);

// Just checking the server
app.get('/', (req, res) => {
  res.send('Trello API is running');
});

// connect to mongodb 
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));
