import { Schema, model } from "mongoose";

const documentSchema = new Schema(
  {
    // fileUrl: { type: String },
    vehicle: { type: String, required: true },
    documentType: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    documentNumber: { type: String, required: true },
    issuingAuth: { type: String, required: true },
    reminderDayBeforeExpiry: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "expiring", "expired"],
      default: "active",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Document = model("Document", documentSchema);

export default Document;
