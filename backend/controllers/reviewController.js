import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Add review
const addReview = async (req, res) => {
    try {
        const { foodId, orderId, rating, comment } = req.body;
        const userId = req.body.userId;
        
        // Get user name
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // Check if order exists and belongs to user
        const order = await orderModel.findOne({ _id: orderId, userId: userId });
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        
        // Check if review already exists
        const existingReview = await reviewModel.findOne({ userId, foodId, orderId });
        if (existingReview) {
            return res.json({ success: false, message: "Review already submitted" });
        }
        
        const review = new reviewModel({
            userId,
            foodId,
            orderId,
            rating,
            comment,
            userName: user.name
        });
        
        await review.save();
        res.json({ success: true, message: "Review added successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error adding review" });
    }
};

// Get reviews for food item
const getReviews = async (req, res) => {
    try {
        const { foodId } = req.params;
        const reviews = await reviewModel.find({ foodId }).sort({ createdAt: -1 });
        
        const avgRating = reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
            : 0;
            
        res.json({ 
            success: true, 
            reviews, 
            avgRating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length 
        });
    } catch (error) {
        res.json({ success: false, message: "Error fetching reviews" });
    }
};

export { addReview, getReviews };