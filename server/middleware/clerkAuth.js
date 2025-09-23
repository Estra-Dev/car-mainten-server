import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import User from "../model/User.model.js";

export const requireAuth = ClerkExpressRequireAuth();

export const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      // from clerk
      const clerkId = req.auth.userId;
      const user = await User.findOne({ clerkId });
      // console.log("clerk", clerkId, "user", user)

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role !== role) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role" });
      }

      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
