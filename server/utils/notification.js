import Maintenance from "../model/Maintenance.model.js";
import Notification from "../model/Notification.model.js";
import Vehicle from "../model/Vehicle.model.js";
import { sendEmail } from "./email.js";

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

    const userEmail = user.email || user; // assuming user object has email field

    await sendEmail({
      to: userEmail,
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
    
  }
}

// check upcoming maintenance and create notifications
export const checkUpcomingMaintenance = async () => {
  const today = new Date();
  const threshold = new Date();
  threshold.setDate(today.getDate() + 60); // 14 days ahead

  const maintenances = await Maintenance.find({
    nextServiceDate: { $gte: today, $lte: threshold },
    notified: false,
  }).populate('vehicleId').populate('createdBy');


  for (const maintenance of maintenances) {
    await createNotification({
      user: maintenance.createdBy.email,
      vehicle: maintenance.vehicleId.model,
      type: "Maintenance Due",
      message: `Maintenance for ${maintenance.vehicleId.make} ${maintenance.vehicleId.model} is due on ${maintenance.nextServiceDate.toDateString()}.`,
      dueDate: maintenance.scheduledDate,
      channel: "email",
    });
  }
}

// check document expiries and create notifications
export const checkDocumentExpiries = async () => {
  const today = new Date();
  const threshold = new Date();
  threshold.setDate(today.getDate() + 60); // 14 days ahead

  const vehicles = await Vehicle.find().populate({
    path: 'documents',
    match: { expiryDate: { $gte: today, $lte: threshold } }
  }
  );

  for(const vehicle of vehicles) {
    for(const doc of vehicle.documents) {
      if(doc.expiryDate >= today && doc.expiryDate <= threshold) {
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
  }
}