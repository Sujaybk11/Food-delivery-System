import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: String,
        city: String,
        state: String,
        zipcode: String,
        coordinates: { lat: Number, lng: Number }
    },
    cuisine: [String],
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isOpen: { type: Boolean, default: true },
    openingHours: {
        open: String,
        close: String
    },
    deliveryRadius: { type: Number, default: 5 },
    minimumOrder: { type: Number, default: 100 },
    deliveryFee: { type: Number, default: 30 },
    preparationTime: { type: Number, default: 30 },
    image: String,
    documents: {
        license: String,
        fssai: String
    },
    earnings: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 }
}, { timestamps: true });

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);
export default restaurantModel;