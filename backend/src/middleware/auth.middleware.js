import { AppDataSource } from "../config/db.js";
import { User } from "../entities/User.js";

import {
  verifyAccessToken,
  hashToken,
} from "../utils/token.utils.js";

// Notice the third parameter: `next`. This is what makes it a middleware!
// If everything succeeds, calling next() tells Express: "This user is legit, 
// move on to the actual route they were trying to access.
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken; 

    if (!token) {
      return res.status(401).json({
        message: "Access token required",
      });
    }

    const payload = verifyAccessToken(token);

    if (payload.type !== "access") {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }
    //  Database Check (The Stateful Validation)
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({
      id: payload.sub,
    });

    if (!user || !user.accessToken) {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }

    const hashedToken = hashToken(token);

    if (hashedToken !== user.accessToken) {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }

    req.user = {
      id: user.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};