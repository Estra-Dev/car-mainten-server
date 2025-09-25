import Document from "../model/Document.model.js";
import Maintenance from "../model/Maintenance.model.js";
import Notification from "../model/Notification.model.js";
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
    const {search, status} = req.query
    const query = {}

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // search across multiple fields
    if (search) {
      query.$or = [
        {make: {$regex: search, $options: "i"}},
        {model: {$regex: search, $options: "i"}},
        {plateNumber: {$regex: search, $options: "i"}},
        {assignedTo: {$regex: search, $options: "i"}},
        {department: {$regex: search, $options: "i"}},
        // {status: {$regex: search, $options: "i"}}
      ]
    }

    // filter by status
    if (status) {
      query.status = status
    }

    const vehicles = await Vehicle.find({createdBy: user._id, ...query}).populate(
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

export const deleteVehicle = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    const id = req.params.id

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const vehicles = await Vehicle.findById(id)
    if (!vehicles) {
      return res.status(404).json({message: "No Such Vehicle"})
    }

    await Maintenance.findOneAndDelete({vehicleId: vehicles._id})
    await Document.findOneAndDelete({vehicle: vehicles.plateNumber})
    await Vehicle.findByIdAndDelete(id)

  } catch (error) {
    res.status(400).json({message: "Server Error" + error.message})
  }
}

export const editVehicle = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    const id = req.params.id
    const update = req.body

    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const vehicle = await Vehicle.findById(id)
    if (!vehicle) {
      return res.status(404).json({message: "No Such Vehicle"})
    }

    const documents = await Document.findOne({vehicle: vehicle.plateNumber})

    Object.keys(update).forEach((key) => {
      if (update[key] === "" || update[key] === null || update[key] === undefined) {
        delete update[key]
      }
    })

    const updated = await Vehicle.findByIdAndUpdate(id, {$set: update}, {new: true})
    documents.vehicle = updated.plateNumber
    
    await documents.save()
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({message: "Server Error" + error.message})
  }
}