const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const router = require('./routes/router');
const database = require('./config/database');
database.database();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server is responding at port ${PORT}`);
});