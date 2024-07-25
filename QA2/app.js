require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const path = require('path');

// rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const csrf = require('csurf');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fs = require('fs'); // (https) Added to read SSL certificate files
const https = require('https'); // (https) Added to create HTTPS server
const http = require('http'); // (https) Added to create HTTP server

// database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const petRouter = require('./routes/petRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// CSRF protection
app.use(csrf({ cookie: true }));

// Middleware to set CSRF token in a cookie
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Secure cookie in production
      maxAge: 1000 * 60 * 60,
    },
  })
);



app.use(fileUpload());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/pets', petRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);


// Static file serving for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, './client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });
}


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



// HTTPS Part of the code

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGO_URI); // Debugging line
    await connectDB(process.env.MONGO_URI);

    // (https) Load SSL certificates
    const keyPath = path.resolve(__dirname, 'key.pem'); // (https) Adjusted path
    const certPath = path.resolve(__dirname, 'cert.pem'); // (https) Adjusted path

    if (!fs.existsSync(keyPath)) {
      throw new Error(`Key file not found at path: ${keyPath}`);
    }
    if (!fs.existsSync(certPath)) {
      throw new Error(`Cert file not found at path: ${certPath}`);
    }

    const options = {
      key: fs.readFileSync(keyPath), // (https) Adjust the path
      cert: fs.readFileSync(certPath), // (https) Adjust the path
    };

    console.log('SSL certificates loaded from:', keyPath, certPath); // (https) Debugging line

    // (https) Create HTTPS server
    https.createServer(options, app).listen(port, () =>
      console.log(`HTTPS Server is listening on port ${port}...`)
    );

    // (https) Create HTTP server to redirect to HTTPS
    http.createServer((req, res) => {
      res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
      res.end();
    }).listen(port, '127.0.0.1', () =>
      console.log(`HTTP to HTTPS redirect server is listening on port ${port}...`)
    );

  } catch (error) {
    console.log('Error starting the server:', error); // Debugging line
  }
};

start();
