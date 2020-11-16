import pkg from 'apollo-server-express';
const {AuthentificationError} = pkg;

import jwt from 'jsonwebtoken'
import {SECRET_KEY} from '../../config.js'
export default (context) => {

  const authHeader = context.req.headers.authorization
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1]
    if (token) {
      try{
        const user = jwt.verify(token,SECRET_KEY)
        return user
      }catch(err) {
        throw new AuthentificationError('Invalid token')
      }
    }
    throw new Error('Authentification token must be Bearer')
  }
  throw new Error('Authentification token must be provided')
}