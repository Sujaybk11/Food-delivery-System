import couponModel from "../models/couponModel.js";

// Apply coupon
const applyCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        
        const coupon = await couponModel.findOne({ 
            code: code.toUpperCase(), 
            isActive: true,
            expiryDate: { $gt: new Date() }
        });
        
        if (!coupon) {
            return res.json({ success: false, message: "Invalid or expired coupon" });
        }
        
        if (orderAmount < coupon.minOrderAmount) {
            return res.json({ 
                success: false, 
                message: `Minimum order amount ₹${coupon.minOrderAmount} required` 
            });
        }
        
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.json({ success: false, message: "Coupon usage limit exceeded" });
        }
        
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (orderAmount * coupon.discount) / 100;
            if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscount);
            }
        } else {
            discountAmount = coupon.discount;
        }
        
        res.json({ 
            success: true, 
            discount: discountAmount,
            couponId: coupon._id,
            message: `Coupon applied! You saved ₹${discountAmount}` 
        });
    } catch (error) {
        res.json({ success: false, message: "Error applying coupon" });
    }
};

// Create coupon (admin)
const createCoupon = async (req, res) => {
    try {
        const coupon = new couponModel(req.body);
        coupon.code = coupon.code.toUpperCase();
        await coupon.save();
        res.json({ success: true, message: "Coupon created successfully" });
    } catch (error) {
        if (error.code === 11000) {
            res.json({ success: false, message: "Coupon code already exists" });
        } else {
            res.json({ success: false, message: "Error creating coupon" });
        }
    }
};

// Get all coupons (admin)
const getCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find().sort({ createdAt: -1 });
        res.json({ success: true, coupons });
    } catch (error) {
        res.json({ success: false, message: "Error fetching coupons" });
    }
};

export { applyCoupon, createCoupon, getCoupons };