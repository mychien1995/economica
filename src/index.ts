import 'reflect-metadata';
import { connectToDatabase, registerDatabaseSchemas } from "./startup";
import express from 'express';
import { AddressInfo } from "net";
import path = require('path');
import { HttpError } from "@applications/models";
import { routes } from './applications/routes';
const bodyParser = require('body-parser')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

connectToDatabase();
registerDatabaseSchemas();
var app = express();
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);
app.use(function (req: any, res: any, next: any) {
    var err = new HttpError(404, 'Not Found');
    next(err);
});

app.use(function (err: any, req: any, res: any, next: any) {
    res.status(err.status || 500);
    res.json({
        'errors': {
            message: err.message,
            error: {}
        }
    });
});

const server = app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + (<AddressInfo>server.address()).port);
});

