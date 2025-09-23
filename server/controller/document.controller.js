import Document from "../model/Document.model.js";
import User from "../model/User.model.js";
import Vehicle from "../model/Vehicle.model.js";
import { getDocumentStatus } from "../utils/getDocumentStatus.js";

export const createDocument = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      vehicle, documentType, issueDate, expiryDate, documentNumber, issuingAuth, reminderDayBeforeExpiry
    } = req.body;

    const vehicl = await Vehicle.findOne({ plateNumber: vehicle });
    if (!vehicl) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    
    const document = new Document({
      // vehicleId,
      vehicle,
      documentType,
      issueDate,
      expiryDate,
      documentNumber,
      issuingAuth,
      reminderDayBeforeExpiry,
      createdBy: user._id,
    });
    
    vehicl.documents.push(document._id);
    
    document.status = getDocumentStatus(
      document.expiryDate,
      document.reminderDayBeforeExpiry
    );

    await vehicl.save();

    await document.save();
    res.status(201).json({
      message: "Documents created successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const allDocuments = async (req, res) => {
  try {

    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const documents = await Document.find({createdBy: user._id});
    res.status(200).json({ documents });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching documents ${error.message}` });
  }
};
