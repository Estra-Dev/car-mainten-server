import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import vehicleRouter from "./routes/vehicle.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import documentRouter from "./routes/document.routes.js";
import notificationRouter from "./routes/notification.router.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import cron from "node-cron";
import Vehicle from "./model/Vehicle.model.js";
import { getVehicleStatus } from "./utils/getVehicleStatus.js";
import { getDocumentStatus } from "./utils/getDocumentStatus.js";
import Maintenance from "./model/Maintenance.model.js";
import { checkDocumentExpiries, checkUpcomingMaintenance } from "./utils/notification.js";
import { sendEmail } from "./utils/email.js";

// Schedule a cron job to run every day at midnight
cron.schedule("* * * * *", async () => {
  console.log("Running a task every day at midnight");
  // Add your scheduled task logic here

  try {
    const vehicles = await Vehicle.find();

    for (const vehicle of vehicles) {
      if (!vehicle.maintenanceHistory.length){
        vehicle.status = "active"; // No maintenance history, set to Active
        await vehicle.save();
        continue;
      }

      // Get the last maintenance record
      const lastMaintenanceId = vehicle.maintenanceHistory[vehicle.maintenanceHistory.length - 1];
      const lastMaintenance = await Maintenance.findById(lastMaintenanceId);

      if (!lastMaintenance) {
        vehicle.status = getVehicleStatus(lastMaintenance.scheduledDate, lastMaintenance.nextServiceDate);
        await vehicle.save();
      }
    }

    console.log("Vehicle statuses updated successfully");

  } catch (error) {
    console.log("Error updating vehicle statuses:", error.message);
  }
});

cron.schedule("* * * * *", async () => {
  console.log("Running a task every day at midnight to update document statuses");
  // Add your scheduled task logic here
  try {

    const documents = await Document.find();

    for (const document of documents) {
      const vehicle = await Vehicle.findById(document.vehicle);
      if (!vehicle.documents.length) {
        document.status = "active"; // No documents, set to active
        await document.save();
        continue;
      }
      const lastDocumentId = vehicle.documents[vehicle.documents.length - 1];
      const lastDocument = await Document.findById(lastDocumentId);

      if (!lastDocument) {
        document.status = getDocumentStatus(lastDocument.expiryDate, lastDocument.reminderDayBeforeExpiry);
        await document.save();
      }
    }

    console.log("Document statuses updated successfully");
  }catch (error) {
    console.log("Error updating document statuses:", error.message);
  }
})

cron.schedule("* * * * *", async () => {
  try {
    console.log("Running a task every day at midnight to check notifications");
    await checkUpcomingMaintenance();
    await checkDocumentExpiries();
    
  } catch (error) {
    console.log("Error loading cron job")
  }
});

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
// app.use(ClerkExpressRequireAuth());

app.use("/api/vehicles", ClerkExpressRequireAuth(), vehicleRouter);
app.use("/api/maintenance", ClerkExpressRequireAuth(), maintenanceRoutes);
app.use("/api/documents", ClerkExpressRequireAuth(), documentRouter);

app.use("/api/notifications", ClerkExpressRequireAuth(), notificationRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});


app.get("/test-email", async (req, res) => {
  const success = await sendEmail({
    to: "dominionib@gmail.com",
    subject: "Test Email from Vehicle Management System",
    text: "This is a test email sent from the Vehicle Management System.",
    html: "<h1>This is a test email sent from the Vehicle Management System.</h1>"
  })

  res.send({success})
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
