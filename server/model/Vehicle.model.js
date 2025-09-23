import { Schema, model } from "mongoose";

const vehicleSchema = new Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    plateNumber: { type: String, required: true, unique: true },
    assignedTo: { type: String, required: true },
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
    maintenanceHistory: [{ type: Schema.Types.ObjectId, ref: "Maintenance" }],
    status: {
      type: String,
      required: true,
      enum: ["active", "service due", "in maintenance"],
    },
    department: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Vehicle = model("Vehicle", vehicleSchema);

export default Vehicle;
