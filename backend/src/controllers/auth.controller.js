import bcrypt from "bcrypt";

import { AppDataSource } from "../config/db.js";
import { User } from "../entities/User.js";

import { createAuthSession , setAuthCookies } from "../utils/auth.utils.js";
import {
  verifyRefreshToken,hashToken
} from "../utils/token.utils.js";

export const register = async(req,res)=>{
  try{
    const{name,email,password}=req.body;
    if(!name || !email || !password) {
      return res.status(400).json({
        message:"Details are Required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userRepository = AppDataSource.getRepository(User);// AppDataSource connects to Postgres. getRepository(User) gives us 
    // the specific toolset to create, read, update, or delete users.

    const existingUser = await userRepository.findOneBy({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      }); //409-conflict error
    }

    const passwordHash = await bcrypt.hash(password, 10);//Salt rounds determine how many times bcrypt loops its hashing algorithm (\(2^{N}\) times) to make passwords exponentially slower and harder for hackers to crack.

    //// .create() prepares the user object in Node.js memory. It does NOT save to Postgres yet.
    const user = userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    //// .save() is the actual database INSERT command. Now the user has a permanent ID.
    await userRepository.save(user);

    //STEP -1 : We pass the newly saved user to our utility. It creates an Access Token (15-min key) and a Refresh Token (7-day key).It also hashes copies of these tokens and saves those hashes to the database.
    const { accessToken, refreshToken } =
      await createAuthSession(user);

      //STEP 2: We take the unhashed tokens and put them inside HTTP-Only cookies.The browser will store these and automatically send them back on future requests. Frontend JS cannot read them, keeping them safe from malicious scripts.
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    ); // The comparision happens internally , based on salt rounds changes the password into hash and then compares it to hashed password and then gets the result

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // JWT GENERATION: User proved who they are. Give them their digital keys.
    const { accessToken, refreshToken } =
      await createAuthSession(user);

    setAuthCookies(res, accessToken, refreshToken);//attaches the generated tokens to the HTTP response object (res) as HttpOnly cookies.

    
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    console.log("Cookies:", req.cookies);

    const token = req.cookies.refreshToken;

    console.log("Refresh token exists:", !!token);
    if (!token) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    const payload = verifyRefreshToken(token);

    if (payload.type !== "refresh") {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const userRepository = AppDataSource.getRepository(User); 

    const user = await userRepository.findOneBy({
      id: payload.sub,
    });//It grabs the user's ID from the token payload (payload.sub) and looks them up in the database., 

    if (!user || !user.refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });//It verifies that the user actually has an active session tracked in the database (user.refreshToken).
    }

    const hashedToken = hashToken(token);

    if (hashedToken !== user.refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    //Instead of just giving the user a new access token, it invalidates the old refresh token and generates a completely new pair of both tokens. This stops replay attacks (if a hacker steals a refresh token, it will only work once before becoming useless)
    const { accessToken, refreshToken: newRefreshToken } =
      await createAuthSession(user);

    setAuthCookies(res, accessToken, newRefreshToken);

    return res.status(200).json({
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const payload = verifyRefreshToken(token);

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({
          id: payload.sub,
        });

        if (user) {
          user.accessToken = null;
          user.accessTokenExpiresAt = null;
          user.refreshToken = null;
          user.refreshTokenExpiresAt = null;

          await userRepository.save(user);
        }
      } catch (error) {
        // Token invalid/expired — still clear cookies below
      }
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

