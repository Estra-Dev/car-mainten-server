import User from "../model/User.model.js";
import { Webhook } from "svix";

export const registerUser = async (req, res) => {
  // const { name, email, password } = req.body;

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  const payload = JSON.stringify(req.body);
  const headers = {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"],
  };

  let evt

  try {
    evt = webhook.verify(payload, headers);
  } catch (error) {
    console.log("verification failed", error.message)
    return res.status(400).json({error: "Invalid webhook Signature"})
  }

  try {
    switch (evt.type) {
      case "user.created":
        // Handle user created event
        const userExists = await User.findOne({
          email: evt.data.email_addresses[0]?.email_address,
        });

        if (userExists) {
          // return res.status(400).json({ message: "User already exists" });
          console.log("User already exists");
          break;
        }
        const user = await User.create({
          clerkId: evt.data.id,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          email: evt.data.email_addresses[0]?.email_address || "me@example.com",
          // password: evt.data.password || "1234456780",
          imageUrl: evt.data.image_url,
        });
        console.log(user);
        break;
      case "user.updated":
        // Handle user updated event
        await User.findOneAndUpdate(
          { clerkId: evt.data.id },
          {
            firstName: evt.data.first_name,
            lastName: evt.data.last_name,
            // password: evt.data.password,
            imageUrl: evt.data.image_url,
          },
          { new: true }
        );
        break;
      case "user.deleted":
        // Handle user deleted event
        await User.findOneAndDelete({
          clerkId: evt.data.id,
        });
        break;
      default:
        // Handle unknown event
        console.log(`Unhandled event type: ${evt.type}`);
        break;
    }

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "User registration failed", error });
  }
};
