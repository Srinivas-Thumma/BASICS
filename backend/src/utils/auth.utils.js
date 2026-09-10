import { AppDataSource } from "../config/db.js";
import { User } from "../entities/User.js";

import{
  generateAccessToken,generateRefreshToken,hashToken
} from "./token.utils.js"

//In token.utils.js, you used strings like "15m" because the jsonwebtoken library understands them. However, standard JavaScript (like the Date object) and Express cookies require time to be calculated in milliseconds.
const ACCESS_TOKEN_EXPIRES_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

//When a user successfully logs in, you pass their user object into this function. First, it uses your utility tools to generate the raw, usable JWTs.
export const createAuthSession = async(user)=>{
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  user.accessToken = hashToken(accessToken);
  user.accessTokenExpiresAt = new 
      Date(Date.now() + ACCESS_TOKEN_EXPIRES_MS);

  user.refreshToken = hashToken(refreshToken);
  user.refreshTokenExpiresAt = new 
      Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);

  //tells TypeORM to update this specific user in your PostgreSQL    
  const userRepository = AppDataSource.getRepository(User);
  await userRepository.save(user);

  return{accessToken , refreshToken}; 

};

export const setAuthCookies = (res,accessToken,refreshToken)=>{
  res.cookie("accessToken",accessToken,{
    httpOnly:true, //prevents Cross-Site Scripting (XSS) attacks
    secure:process.env.NODE_ENV === "production", //in local it stays false :)
    sameSite:"lax", //protection against (CSRF). It ensures that another random website cannot trick the browser into sending these cookies to your backend without the user's consent.
    maxAge: ACCESS_TOKEN_EXPIRES_MS, //Tells the browser exactly when to automatically delete the cookie so a stale session doesn't stick around forever.
  });

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: REFRESH_TOKEN_EXPIRES_MS,
});

}
