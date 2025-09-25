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
    const {vehicleSearch, status} = req.query
    const query = {}

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    
    // search
    if (vehicleSearch) {
      query.$or = [
        {vehicle: {$regex: vehicleSearch, $options: "i"}}
      ]
    }

    // filter
    if (status) {
      query.status = status
    }
    const documents = await Document.find({createdBy: user._id, ...query});
    res.status(200).json({ documents });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching documents ${error.message}` });
  }
};

export const deleteDoc = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    const id = req.params.id;
    const vehicl = await Vehicle.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "No Such Document" });
    }

    // remove reference from vehicle
    await Vehicle.updateOne(
      { plateNumber: doc.vehicle },
      { $pull: { documents: doc._id } }
    );

    await Document.findByIdAndDelete(id);

    res.status(200).json({ message: "Document Deleted" });
  } catch (error) {
    res.status(500).json({message: "Server" + error.message})
  }
}

export const editDoc = async (req, res) => {
  
  
  try {
    const id = req.params.id

    console.log("Edit", id)

    const clerkId = req.auth.userId
    const user = await User.findOne({clerkId})
    const update = req.body

    if (!user) {
      return res.status(404).json({message: "User not found"})
    }

    const doc = await Document.findById(id)
    if (!doc) {
      return res.status(404).json({message: "No Such Document"})
    }
    Object.keys(update).forEach((key) => {
      if (
        update[key] === "" ||
        update[key] === null ||
        update[key] === undefined
      ) {
        delete update[key];
      }
    });

    const updated = await Document.findByIdAndUpdate(id, {$set: update}, {new: true})
    console.log("updated", updated)
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({message: "Server Error " + error.message})
  }
}
