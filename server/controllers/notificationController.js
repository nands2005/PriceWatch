const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.userId,
        })
            .populate("productId", "name url")
            .sort({
                createdAt: -1,
            });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Get notifications error:", error);

        res.status(500).json({
            message: "Failed to fetch notifications",
            error: error.message,
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.userId,
                },
                {
                    isRead: true,
                },
                {
                    new: true,
                }
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
            });
        }

        res.status(200).json({
            message: "Notification marked as read",
            notification,
        });
    } catch (error) {
        console.error(
            "Mark notification error:",
            error
        );

        res.status(500).json({
            message: "Failed to update notification",
            error: error.message,
        });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
};