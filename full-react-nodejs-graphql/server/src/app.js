import express from 'express';
import schema from './schema';
import graphqlHTTP from 'express-graphql';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes';
import { createToken, verifyToken } from './auth';

const app = express();
app.disable('x-powered-by');

// Allow cor
app.use('/graphql', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,  Authorization, Content-Length, X-Requested-With'
  );
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Magic code for graphql work
app.use('/login', jsonParser, (req, res) => {
  if (req.method === 'POST') {
    const token = createToken(req.body.email, req.body.password);
    if (token) {
      //send successful token
      res.status(200).json({ token });
    } else {
      res.status(403).json({
        //no token - invalid credentials
        message: 'Login failed! Invalid credentials!',
      });
    }
  }
});

/**
 * Verify token and return either error or valid user profile
 */
app.use('/verifyToken', jsonParser, (req, res) => {
  if (req.method === 'POST') {
    try {
      const token = req.headers['authorization'];
      const user = verifyToken(token);
      res.status(200).json({ user });
    } catch (e) {
      console.log(e.message);
      res.status(401).json({
        //unauthorized token
        message: e.message,
      });
    }
  }
});

//auth middleware
app.use('/graphql', (req, res, next) => {
  const token = req.headers['authorization'];
  try {
    req.user = verifyToken(token);
    next();
  } catch (e) {
    res.status(401).json({
      //unauthorized token
      message: e.message,
    });
  }
});

app.use(
  '/graphql',
  graphqlHTTP((req, res) => ({
    schema,
    graphiql: true,
    context: {
      user: req.user,
    },
  }))
);

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(
  logger('dev', {
    skip: () => app.get('env') === 'test',
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  res.status(err.status || 500).render('error', {
    message: err.message,
  });
});

export default app;
