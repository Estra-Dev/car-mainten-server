import { Schema, model } from "mongoose";

const maintenanceSchema = new Schema(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    vehiclePlateNo: { type: String, required: true },
    priority: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    serviceType: { type: String, required: true },
    estimatedCost: { type: Number, required: true },
    nextServiceDate: { type: Date, required: true },
    note: { type: String, required: true },
    createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true}
  },
  { timestamps: true }
);

const Maintenance = model("Maintenance", maintenanceSchema);

export default Maintenance;
