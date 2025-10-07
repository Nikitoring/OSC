import { response } from "express";

export const sendRefreshToken = (res=response ,token) => {
  res.cookie("authorization", token, {
    // httpOnly: true
  })
}