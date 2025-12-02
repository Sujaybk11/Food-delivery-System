import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Food name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: { 
    type: String, 
    required: [true, 'Image is required']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true
  },
  quantity: {
    type: Number,
    default: 100,
    min: [0, 'Quantity cannot be negative']
  },
  outOfStock: {
    type: Boolean,
    default: false
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Threshold cannot be negative']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
foodSchema.index({ category: 1 });
foodSchema.index({ name: 'text', description: 'text' });
foodSchema.index({ price: 1 });
foodSchema.index({ isAvailable: 1 });

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
