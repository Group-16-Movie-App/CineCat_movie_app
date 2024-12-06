import jwt from "jsonwebtoken";
import pool from "../config/database.js";

export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Get user from database
    const result = await pool.query(
      "SELECT id, email, name, token_version FROM accounts WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      throw new Error();
    }

    const user = result.rows[0];
    console.log("User fetched from database:", user);
    // Check if the token version is still valid
    if (user.token_version !== decoded.token_version) {
      return res.status(401).json({ message: "Token is no longer valid" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
