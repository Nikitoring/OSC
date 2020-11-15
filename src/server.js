import express from 'express'
import { port, dbURI } from '../config.js'
import cors from 'cors'
import mongoose from 'mongoose'
// Подключаем  graphql
import SERVER from './graphql/Schema.js'

import Cat from './models/Cat.js'

const startServer = async () => {
  const app = express()
  app.use(cors())

  // Middleware: GraphQL
  SERVER.applyMiddleware({
    app,
  })

  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })

  app.listen(port, () => {
    console.log(
      `Example app listening at http://localhost:${port}${SERVER.graphqlPath}`,
    )
  })
}

startServer()

// app.use('/api/cats', catsRoute)
