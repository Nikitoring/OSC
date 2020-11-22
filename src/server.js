import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { port, dbURI } from '../config.js'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
// Подключаем  graphql
import SERVER from './graphql/Schema.js'
import cookieParser from 'cookie-parser'

const startServer = async (req, res) => {
  const app = express()

  // CORS configuration
  const corsOptions = {
    origin: true,
    credentials: true,
  }

  app.use(cors(corsOptions));
  // Pass in session auth middleware to express
	app.use(
		session({
			secret: `${process.env.SESSION_SECRET}`,
			resave: false, // Only resaves session w/ change
			saveUninitialized: false // Don't assign a user a session til we give them data
		})
	);
  // Middleware: GraphQL
  SERVER.applyMiddleware({
    app,
    path: '/',
    cors: false
  })

  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })

  app.listen(port, () => {
    console.log(
      `Server listening http://localhost:${port}`,
      `Graphql listening http://localhost:${port}${SERVER.graphqlPath}`,
    )
  })
}

startServer()
