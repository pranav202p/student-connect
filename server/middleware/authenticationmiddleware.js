import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer header

  if (token == null) return res.sendStatus(401); // If no token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid, forbidden

    try {
      const foundUser = await User.findById(user.id); // Find user by ID in token
      if (!foundUser) return res.sendStatus(404); // If user not found, not found

      req.user = foundUser; // Attach user to request
      next(); // Proceed to the next middleware/route
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Internal server error
    }
  });
}
