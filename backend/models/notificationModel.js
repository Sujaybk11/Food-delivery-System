import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['order', 'promotion', 'system'], default: 'system' },
    isRead: { type: Boolean, default: false },
    orderId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

const notificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema);
export default notificationModel;