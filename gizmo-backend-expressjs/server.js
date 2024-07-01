require('rootpath')();
const express = require("express"),
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
// const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
        title: "Gizmo DM IoT",
        version: "0.1.2",
        description:
            "This is a DM server with simple CRUD API application made with Express and documented with Swagger",
        license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
            name: "Razortooth Communications, LLC",
            url: "https://razortooth.biz",
            email: "info@hushmail.com",
        },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/**/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt.jwt());

// api routes
// app.use('/users', require('./users/users.controller'));
app.use('/users', require('./routes/users/users.controller'));
app.use('/bits', require('./routes/bits/bits.controller'));

// global error handler
app.use(errorHandler.errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 3000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
