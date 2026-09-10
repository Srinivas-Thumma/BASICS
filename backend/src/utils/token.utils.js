import jwt from "jsonwebtoken";
import crypto from "crypto";

//Instead of writing the complex logic to create and verify tokens directly inside your login or signup routes (which would make those files huge and messy), you extract those specific tasks into this token.util.js file. Now, anytime any part of your app needs to deal with a token, it just "borrows the tool" from this file. It keeps your code clean, organized, and reusable (a principle known as DRY - Don't Repeat Yourself).

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const generateAccessToken = (userId)=>{
  return jwt.sign(
    { sub:userId,type:"access", },//payload
    process.env.ACCESS_TOKEN_SECRET,{expiresIn:ACCESS_TOKEN_EXPIRES_IN}
  );
};

export const generateRefreshToken = (userId)=>{
  return jwt.sign(
    {sub:userId,type:"refresh",},
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: REFRESH_TOKEN_EXPIRES_IN,}
  );
};

export const verifyAccessToken =(token) =>{
  return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken =(token)=>{
  return jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
};

export const hashToken = (token)=>{
  return crypto 
    .createHash("sha256")
    .update(token)
    .digest("hex");
  }
