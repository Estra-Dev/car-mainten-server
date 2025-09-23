import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    type: {
      type: String,
      enum: ["Document Expiry", "Maintenance Due"],
      required: true,
    },
    message: { type: String, required: true },
    dueDate: { type: Date },
    channel: {
      type: String,
      enum: ["email", "sms", "in-app"],
      default: "email",
    },
    status: {
      type: String,
      enum: ["sent", "pending", "failed"],
      default: "pending",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = model("Notification", notificationSchema);

export default Notification;
