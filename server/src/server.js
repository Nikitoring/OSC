import cors from 'cors'
import "reflect-metadata"
import express from 'express'
import { port, dbURI } from '../config.js'
import mongoose from 'mongoose'
import apolloServer from './graphql/ApolloServer.js'
import cookieParser from 'cookie-parser'
import pkg from 'jsonwebtoken'
const { verify } = pkg
import { sendRefreshToken } from './utils/sendRefreshToken.js'
import { createRefreshToken } from './utils/auth.js'

;(async () => {
  const app = express()

  // CORS configuration
  const corsOptions = {
    origin: 'http://0.0.0.0:5000',
    credentials: true,
  }
  app.use(cors(corsOptions))

  app.use(cookieParser())
  app.get('/', (_req,res) => res.send('Server Run'))

  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.authorization
    if (!token) {
      return res.send({ ok: false, token: '' })
    }
    let payload = null
    try {
      payload = verify(token, process.env.ACCESS_SECRET_KEY)
    } catch (err) {
      console.error(err)
      return res.send({ ok: false, token: '' })
    }
    const user = await User.findOne({ id: payload.id })

    if (!user) {
      return res.send({ ok: false, token: '' })
    }

    if (user.token !== payload.token) {
      return res.send({ ok: false, token: '' })
    }

    sendRefreshToken(res, createRefreshToken(user))

    return res.send({ ok: true, token: createAccessToken(user) })
  })
  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  // Middleware: GraphQL
  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: 'http://0.0.0.0:5000'
    },
    path: "/",
  })

  app.listen(port, () => {
    console.log(
      `Server listening http://localhost:${port}`,
      `Graphql listening http://localhost:${port}${apolloServer.graphqlPath}`,
    )
  })
})()
