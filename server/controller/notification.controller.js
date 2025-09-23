import Notification from "../model/Notification.model.js";

// get notification

export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId)
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    console.log(notifications)
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