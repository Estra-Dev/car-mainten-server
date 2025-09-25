import Maintenance from "../model/Maintenance.model.js";
import User from "../model/User.model.js";
import Vehicle from "../model/Vehicle.model.js";
import { getVehicleStatus } from "../utils/getVehicleStatus.js";

export const createMaintenance = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // const vehicle = await Vehicle.findById(req.params.plateNumber);
    // if (!vehicle) {
    //   return res.status(404).json({ message: "Vehicle not found" });
    // }

    const {
      vehiclePlateNo,
      priority,
      scheduledDate,
      serviceType,
      estimatedCost,
      nextServiceDate,
      note,
    } = req.body;

    const vehicle = await Vehicle.findOne({ plateNumber: vehiclePlateNo });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    const maintenance = new Maintenance({
      vehicleId: vehicle._id,
      vehiclePlateNo,
      priority,
      scheduledDate,
      serviceType,
      estimatedCost,
      nextServiceDate,
      createdBy: user._id,
      note,
    });

    vehicle.maintenanceHistory.push(maintenance._id);
    
    vehicle.status = getVehicleStatus(scheduledDate, nextServiceDate);

    await vehicle.save();
    await maintenance.save();

    res.status(201).json({
      message: "Maintenance record created successfully",
      maintenance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const allMaintenance = async (req, res) => {
  try {

    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const maintenances = await Maintenance.find({createdBy: user._id});
    res.status(200).json({ maintenances });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching maintenances ${error.message}` });
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    const id = req.params.id

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const maintenance = await Maintenance.findById(id)
    if (!maintenance) {
      return res.status(404).json({message: "No Such Maintenace record"})
    }

    await Vehicle.updateOne({ _id: maintenance.vehicleId }, {$pull: {maintenanceHistory: maintenance._id}});
    await Maintenance.findByIdAndDelete(id)

    res.status(200).json({message: "Maintenance Deleted"})
  } catch (error) {
    res.status(400).json({message: "Server Error" + error.message})
  }
}

export const editMaintenance = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    const id = req.params.id
    const update = req.body

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const maintenance = await Maintenance.findById(id);
    if (!maintenance) {
      return res.status(404).json({ message: "No Such Maintenace record" });
    }

    Object.keys(update).forEach((key) => {
      if (update[key] === "" || update[key] === null || update[key] === undefined) {
        delete update[key]
      }
    })

    const updated = await Maintenance.findByIdAndUpdate(id, {$set: update}, {new: true})
    console.log("Updated", updated)
    res.status(200).json(updated)
    
  } catch (error) {
    res.status(400).json({message: "Server Error"})
  }
}