import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

// supporting content types json, urlencoded for now
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import * as db from './config/db.config';
db();

import passport from './config/auth.config';
app.use(passport.initialize());

app.listen(
  process.env.PORT ? process.env.PORT : 8080,
  console.log(
    `listening on http://localhost:${
      process.env.PORT ? process.env.PORT : 8080
    }/`,
  ),
);
