import jwt from "jsonwebtoken";
import pool from "../config/database.js";

export const auth = async (req, res, next) => {
  try {

    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT id, email, name, token_version FROM accounts WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      throw new Error();
    }

    const user = result.rows[0];

    if (user.token_version !== decoded.token_version) {
      return res.status(401).json({ message: "Token is no longer valid" });
    }

    req.user = user; 
    next();  
  } catch (error) {
    console.error("Token verification failed:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: "Token has expired" });
    }
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
