import Maintenance from "../model/Maintenance.model.js";
import Notification from "../model/Notification.model.js";
import User from "../model/User.model.js";
import Vehicle from "../model/Vehicle.model.js";
import { sendEmail } from "./email.js";


const getDateRange = (daysAhead = 14) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const threshold = new Date(today);
  threshold.setDate(today.getDate() + daysAhead);
  threshold.setHours(23, 59, 59, 999);

  return { today, threshold };
};

// create notification helper
const createNotification = async ({user, vehicle, type, message, dueDate }) => {
  try {
    const notification = await Notification.create({
      user,
      vehicle,
      type,
      message,
      dueDate,
      channel: "in-app",
      status: "pending",
    });

    const userDoc = await User.findById(user); // assuming user object has email field

    if (!userDoc || !userDoc.email) {
      console.error("❌ User not found or missing email:", user);
      return;
    }
    // console.log("email", userEmail)
    await sendEmail({
      to: userDoc.email,
      subject: `Vehicle Management Notification: ${type}`,
      text: message,
      html: `<p>${message}</p> <p>Due Date: ${dueDate.toDateString()}</p>`,
    })

    // update notification status to sent
    notification.status = "sent";
    await notification.save();


    // // if channel is email, send email

    // if(channel === "email") {
    // }

    return notification;
  } catch (error) {
    console.error("❌ createNotification error:", error);
  }
}

// check upcoming maintenance and create notifications
export const checkUpcomingMaintenance = async () => {
  const { today, threshold } = getDateRange(14); // 14 days ahead

  try {
    const maintenances = await Maintenance.find({
      scheduledDate: { $gte: today, $lte: threshold },
    }).populate("vehicleId").populate("createdBy");

    if (!maintenances.length) {
      console.log("✅ No upcoming maintenance found.");
      return;
    }
  
    console.log("Maintenance", today, threshold, maintenances);
    
    for (const maintenance of maintenances) {
      console.log("userrr", maintenance.vehiclePlateNo);
      if (!maintenance.vehicleId || !maintenance.createdBy) continue;
      
      await createNotification({
        user: maintenance.createdBy._id,
        vehicle: maintenance.vehicleId._id,
        type: "Maintenance Due",
        message: `Maintenance for ${maintenance.vehiclePlateNo} 
        } will be due on ${maintenance.nextServiceDate.toDateString()}.`,
        dueDate: maintenance.scheduledDate,
        channel: "email",
      });     
    }
  } catch (error) {
    console.error("❌ Error checking maintenance:", error.message);
  }
}

// check document expiries and create notifications
export const checkDocumentExpiries = async () => {
  const { today, threshold } = getDateRange(14); // 14 days ahead

  try {
    const vehicles = await Vehicle.find().populate({
      path: 'documents',
      match: { expiryDate: { $gte: today, $lte: threshold } }
    });
  
    if (!vehicles.length) {
      console.log("✅ No documents expiring soon.");
      return;
    }
    // console.log("Vehicle", vehicles)
  
    for(const vehicle of vehicles) {
      for(const doc of vehicle.documents) {
        await createNotification({
          user: vehicle.createdBy,
          vehicle: vehicle._id,
          type: "Document Expiry",
          message: `The document ${doc.documentType} for your vehicle ${vehicle.make} ${vehicle.model} is expiring on ${doc.expiryDate.toDateString()}.`,
          dueDate: doc.expiryDate,
          channel: "email",
        });
      }
    }
  } catch (error) {
    console.error("❌ Error checking document expiries:", error.message);
  }

  
}