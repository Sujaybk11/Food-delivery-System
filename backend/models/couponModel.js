import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);
export default couponModel;