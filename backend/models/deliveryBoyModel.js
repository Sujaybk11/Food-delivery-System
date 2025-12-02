import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, enum: ['bike', 'bicycle', 'car'], default: 'bike' },
    vehicleNumber: String,
    drivingLicense: String,
    aadharCard: String,
    currentLocation: {
        lat: Number,
        lng: Number,
        lastUpdated: { type: Date, default: Date.now }
    },
    isAvailable: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    currentOrder: { type: String, default: null },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    totalDeliveries: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const deliveryBoyModel = mongoose.models.deliveryBoy || mongoose.model("deliveryBoy", deliveryBoySchema);
export default deliveryBoyModel;