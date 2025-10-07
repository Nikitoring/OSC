import User from '../models/User.js'
import jwt from 'jsonwebtoken'

export const createAccessToken = (user = User) => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: '1h' },
  )
}

export const createRefreshToken = (user = User) => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.REFRESH_SECRET_KEY,
    {
      expiresIn: '1d',
    },
  )
}
