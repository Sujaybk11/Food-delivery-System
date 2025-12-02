import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User ID is required']
  },
  items: { 
    type: [{
      _id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      image: String
    }], 
    required: [true, 'Order items are required'],
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Order must contain at least one item'
    }
  },
  amount: { 
    type: Number, 
    required: [true, 'Order amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  address: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipcode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true }
  },
  status: { 
    type: String, 
    enum: [
      "Food Processing", 
      "Out for delivery", 
      "Delivered", 
      "Cancelled",
      "Preparing",
      "Ready for pickup"
    ],
    default: "Food Processing" 
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "Stripe", "PayPal"],
    default: "COD"
  },
  payment: { 
    type: Boolean, 
    default: false 
  },
  paymentId: String,
  deliveryTime: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ payment: 1 });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
