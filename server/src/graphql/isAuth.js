import {MiddlewareFn} from 'graphql'
import { verify } from "jsonwebtoken";
import { request, response} from 'express'

const context = {
  req: request,
  res: response
}

export const isAuth = ({ctx = context}, next) => {
  const authorization = ctx.req.headers['authorization']
  if (!authorization) {
    throw new Error('not authorzation')
  }

  try {
    const token = authorization.split(' ')[1]
    const payload = verify(token, process.env.ACCESS_SECRET_KEY)
    ctx.payload = payload
  } catch (err) {
    console.log(err)
    throw new Error('not authorzation')
  }
  return next()
}