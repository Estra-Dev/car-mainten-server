import User from "../model/User.model.js";
import Vehicle from "../model/Vehicle.model.js";

export const createVehicle = async (req, res) => {
  // Logic to create a vehicle
  console.log("Vehicles");
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { plateNumber, make, model, year, assignedTo, department } = req.body;

    const newVehicle = new Vehicle({
      plateNumber,
      make,
      model,
      year,
      assignedTo,
      createdBy: user._id,
      department,
      status: "active",
    });

    await newVehicle.save();

    res
      .status(201)
      .json({ message: "Vehicle created successfully", vehicle: newVehicle });
    console.log("Vehicle created successfully:", newVehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ message: "Failed to create vehicle." });
  }
};

export const getVehicles = async (req, res) => {
  try {

    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const vehicles = await Vehicle.find({createdBy: user._id}).populate(
      "createdBy",
      "firstName lastName role email"
    );
    res.status(200).json({ vehicles });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching vehicles ${error.message}` });
  }
};
