// The native modules that provide access to the file system and routes
import fs from 'fs';
import path from 'path';

// The module for importing the environment variables from the .env configuration file
import dotenv from 'dotenv';

// Express itself
import express from 'express';

// The middlewares for extending the functionality of express
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// graphql middleware
import graphqlHTTP from 'express-graphql';

// The middleware for logging server logs
import morgan from 'morgan';

// Creating the config method for importing environment variables
dotenv.config();

// Creating an instance of express
const app = express();

// Creating a stream for logging server logs
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// CORS configuration, in which the origin parameter
// is responsible for recalculation of hosts that enable
// queries to the server and credentials to
// pass cookies
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};

// Executing the use method to define middleware
app
  .use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-type] ":referrer" ":user-agent"',
      { stream: accessLogStream }
    )
  )
  .use(cors(corsOptions))
  .use(bodyParser())
  .use(cookieParser());

app.get('/', (req, res) => {
  // Server response
  res.send('Hello World!');
});

app.listen(process.env.PORT);

console.log(`Server is running at ${process.env.HOST}:${process.env.PORT}`);
