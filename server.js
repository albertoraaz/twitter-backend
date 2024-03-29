const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const routes = require('./routes/routes');
require("dotenv").config();
app.use(cors({
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204
}));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// route
routes(app);



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    var environment = process.env.NODE_ENV || 'development';
    console.log(`Server is running on port: ${PORT}.`);
});