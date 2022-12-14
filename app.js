import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

// supporting content types json, urlencoded for now
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import db from './config/db.config.js';
db();

app.use(
  morgan(
    process.env["ENV"]==='dev'?'[:date[clf]] ":method :url :status" :res[content-length] - :response-time ms':':remote-addr - [:date[clf]] ":method :url :status" :res[content-length] - :response-time ms'
  ),
);

import passport from './config/auth.config.js';
app.use(passport.initialize());

import authRoutes from './routes/auth.routes.js';
app.use('/', authRoutes);

import formRoutes from './routes/form.routes.js';
app.use('/form', formRoutes);

import projectRoutes from './routes/project.routes.js';
app.use('/project', projectRoutes);

import userRoutes from './routes/user.routes.js';
app.use('/user', userRoutes);

app.listen(
  process.env.PORT ? process.env.PORT : 8080,
  console.log(
    `listening on http://localhost:${
      process.env.PORT ? process.env.PORT : 8080
    }/`,
  ),
);
