import crypto from "crypto";

const CSRF_TOKEN_LENGTH = 32;

export const generateCsrfToken = () => {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
};

export const csrfToken = (req, res) => {
  const token = generateCsrfToken();

  res.cookie("csrfToken", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({ csrfToken: token });
};

export const verifyCsrfToken = (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies.csrfToken;
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken) {
    return res.status(403).json({
      message: "CSRF token required",
    });
  }

  if (cookieToken !== headerToken) {
    return res.status(403).json({
      message: "Invalid CSRF token",
    });
  }

  next();
};