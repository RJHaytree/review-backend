// import libraries
const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');

// routes
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const businessIntelRoutes = require('./routes/businessIntelRoutes');

// init app
const app = express();
app.use(express.json());
app.use(logger('dev'));
app.set('trust proxy', 1);
const corsOptions = {
    exposedHeaders: 'Auth-Token'
};

app.use(cors(corsOptions));

app.use('/user', userRoutes);
app.use('/items', itemRoutes);
app.use('/reviews', reviewRoutes);
app.use('/bi', businessIntelRoutes);

app.use((req, res) => {
    res.status(404).send("Sorry endpoint not found! Please consult the documentation");
});

module.exports = app;