import Notification from "../model/Notification.model.js";

// get notification

export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error.message });
  }
}

// mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error.message });
  } 
}

export const deleteNotification = async (req, res) => {
  try {
    const id = req.params.id

    const noti = await Notification.findById(id)
    if (!noti) {
      return res.status(404).json({message: "No Such Notification"})
    }
    await Notification.findByIdAndDelete(id)
    res.status(200).json("Deleted Successfully")
  } catch (error) {
    res.status(400).json({message: "Server Error" + error.message})
  }
}