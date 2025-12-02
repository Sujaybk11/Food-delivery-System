import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    landmark: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    coordinates: {
        lat: Number,
        lng: Number
    },
    isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const addressModel = mongoose.models.address || mongoose.model("address", addressSchema);
export default addressModel;