import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

// Secure file path validation
const validateFilePath = (filename) => {
  const normalizedPath = path.normalize(filename);
  return !normalizedPath.includes('..') && !path.isAbsolute(normalizedPath);
};

// add food items

const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "Image is required" });
    }
    
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
      quantity: req.body.quantity || 100,
      lowStockThreshold: req.body.lowStockThreshold || 10,
      outOfStock: false
    });
    
    // Check if request has admin token or user is admin
    const { token } = req.headers;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.isAdmin) {
      // Admin token - proceed
      await food.save();
      res.json({ success: true, message: "Food Added Successfully!" });
    } else if (req.body.userId) {
      // User token - check if user is admin
      let userData = await userModel.findById(req.body.userId);
      if (userData && userData.role === "admin") {
        await food.save();
        res.json({ success: true, message: "Food Added Successfully!" });
      } else {
        res.json({ success: false, message: "Access denied. Admin privileges required." });
      }
    } else {
      res.json({ success: false, message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    console.error('Add food error:', error);
    res.json({ success: false, message: "Failed to add food item" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    console.log('Sending food list with', foods.length, 'items');
    console.log('Sample item:', foods[0]);
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const food = await foodModel.findById(req.body.id);
      if (food && food.image && validateFilePath(food.image)) {
        const safePath = path.join('uploads', path.basename(food.image));
        fs.unlink(safePath, () => {});
      }
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// seed sample food items
const seedFoodItems = async (req, res) => {
  try {
    const sampleFoods = [
      {
        name: "Greek Salad",
        description: "Fresh vegetables with feta cheese and olive oil",
        price: 12,
        category: "Salad",
        image: "food_1.png"
      },
      {
        name: "Veg Salad",
        description: "Mixed vegetables with dressing",
        price: 18,
        category: "Salad",
        image: "food_2.png"
      },
      {
        name: "Clover Salad",
        description: "Healthy green salad with herbs",
        price: 16,
        category: "Salad",
        image: "food_3.png"
      },
      {
        name: "Chicken Salad",
        description: "Grilled chicken with fresh greens",
        price: 24,
        category: "Salad",
        image: "food_4.png"
      },
      {
        name: "Lasagna Rolls",
        description: "Delicious pasta rolls with cheese",
        price: 14,
        category: "Rolls",
        image: "food_5.png"
      },
      {
        name: "Peri Peri Rolls",
        description: "Spicy chicken rolls",
        price: 12,
        category: "Rolls",
        image: "food_6.png"
      },
      {
        name: "Chicken Rolls",
        description: "Tender chicken wrapped in bread",
        price: 20,
        category: "Rolls",
        image: "food_7.png"
      },
      {
        name: "Veg Rolls",
        description: "Fresh vegetable rolls",
        price: 15,
        category: "Rolls",
        image: "food_8.png"
      },
      {
        name: "Ripple Ice Cream",
        description: "Creamy vanilla ice cream",
        price: 14,
        category: "Deserts",
        image: "food_9.png"
      },
      {
        name: "Fruit Ice Cream",
        description: "Mixed fruit flavored ice cream",
        price: 22,
        category: "Deserts",
        image: "food_10.png"
      },
      {
        name: "Jar Ice Cream",
        description: "Premium ice cream in jar",
        price: 10,
        category: "Deserts",
        image: "food_11.png"
      },
      {
        name: "Vanilla Ice Cream",
        description: "Classic vanilla ice cream",
        price: 12,
        category: "Deserts",
        image: "food_12.png"
      },
      {
        name: "Chicken Sandwich",
        description: "Grilled chicken sandwich",
        price: 12,
        category: "Sandwich",
        image: "food_13.png"
      },
      {
        name: "Vegan Sandwich",
        description: "Healthy vegan sandwich",
        price: 18,
        category: "Sandwich",
        image: "food_14.png"
      },
      {
        name: "Grilled Sandwich",
        description: "Toasted sandwich with cheese",
        price: 16,
        category: "Sandwich",
        image: "food_15.png"
      },
      {
        name: "Bread Sandwich",
        description: "Simple bread sandwich",
        price: 24,
        category: "Sandwich",
        image: "food_16.png"
      },
      {
        name: "Cup Cake",
        description: "Sweet chocolate cupcake",
        price: 14,
        category: "Cake",
        image: "food_17.png"
      },
      {
        name: "Vegan Cake",
        description: "Healthy vegan cake",
        price: 12,
        category: "Cake",
        image: "food_18.png"
      },
      {
        name: "Butterscotch Cake",
        description: "Rich butterscotch flavored cake",
        price: 20,
        category: "Cake",
        image: "food_19.png"
      },
      {
        name: "Sliced Cake",
        description: "Fresh sliced cake",
        price: 15,
        category: "Cake",
        image: "food_20.png"
      },
      {
        name: "Garlic Mushroom",
        description: "Sautéed mushrooms with garlic",
        price: 14,
        category: "Pure Veg",
        image: "food_21.png"
      },
      {
        name: "Fried Cauliflower",
        description: "Crispy fried cauliflower",
        price: 22,
        category: "Pure Veg",
        image: "food_22.png"
      },
      {
        name: "Mix Veg Pulao",
        description: "Aromatic rice with mixed vegetables",
        price: 10,
        category: "Pure Veg",
        image: "food_23.png"
      },
      {
        name: "Rice Zucchini",
        description: "Rice with fresh zucchini",
        price: 12,
        category: "Pure Veg",
        image: "food_24.png"
      },
      {
        name: "Cheese Pasta",
        description: "Creamy cheese pasta",
        price: 12,
        category: "Pasta",
        image: "food_25.png"
      },
      {
        name: "Tomato Pasta",
        description: "Pasta in rich tomato sauce",
        price: 18,
        category: "Pasta",
        image: "food_26.png"
      },
      {
        name: "Creamy Pasta",
        description: "Pasta in white cream sauce",
        price: 16,
        category: "Pasta",
        image: "food_27.png"
      },
      {
        name: "Chicken Pasta",
        description: "Pasta with grilled chicken",
        price: 24,
        category: "Pasta",
        image: "food_28.png"
      },
      {
        name: "Butter Noodles",
        description: "Noodles tossed in butter",
        price: 14,
        category: "Noodles",
        image: "food_29.png"
      },
      {
        name: "Veg Noodles",
        description: "Stir-fried vegetable noodles",
        price: 12,
        category: "Noodles",
        image: "food_30.png"
      },
      {
        name: "Somen Noodles",
        description: "Traditional Japanese noodles",
        price: 20,
        category: "Noodles",
        image: "food_31.png"
      },
      {
        name: "Cooked Noodles",
        description: "Simple cooked noodles",
        price: 15,
        category: "Noodles",
        image: "food_32.png"
      }
    ];

    await foodModel.deleteMany({});
    await foodModel.insertMany(sampleFoods);
    res.json({ success: true, message: "Sample food items added successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error seeding food items" });
  }
};

// update food inventory
const updateInventory = async (req, res) => {
  try {
    const { id, quantity, lowStockThreshold, outOfStock } = req.body;
    
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const updateData = {};
      
      if (quantity !== undefined) updateData.quantity = quantity;
      if (lowStockThreshold !== undefined) updateData.lowStockThreshold = lowStockThreshold;
      if (outOfStock !== undefined) updateData.outOfStock = outOfStock;
      
      // Auto set out of stock if quantity is 0
      if (quantity === 0) updateData.outOfStock = true;
      if (quantity > 0 && outOfStock === false) updateData.outOfStock = false;
      
      await foodModel.findByIdAndUpdate(id, updateData);
      res.json({ success: true, message: "Inventory updated successfully" });
    } else {
      res.json({ success: false, message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    console.error('Update inventory error:', error);
    res.json({ success: false, message: "Failed to update inventory" });
  }
};

// update food price
const updatePrice = async (req, res) => {
  try {
    const { id, price } = req.body;
    
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await foodModel.findByIdAndUpdate(id, { price: price });
      res.json({ success: true, message: "Price updated successfully" });
    } else {
      res.json({ success: false, message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    console.error('Update price error:', error);
    res.json({ success: false, message: "Failed to update price" });
  }
};

// update food image
const updateImage = async (req, res) => {
  try {
    const { id } = req.body;
    
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      if (!req.file) {
        return res.json({ success: false, message: "Image is required" });
      }
      
      // Get old image to delete
      const food = await foodModel.findById(id);
      if (food && food.image && validateFilePath(food.image)) {
        const safePath = path.join('uploads', path.basename(food.image));
        fs.unlink(safePath, () => {});
      }
      
      // Update with new image
      const newImageFilename = req.file.filename;
      await foodModel.findByIdAndUpdate(id, { image: newImageFilename });
      
      res.json({ success: true, message: "Image updated successfully" });
    } else {
      res.json({ success: false, message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    console.error('Update image error:', error);
    res.json({ success: false, message: "Failed to update image" });
  }
};

// Toggle food availability
const toggleAvailability = async (req, res) => {
  try {
    const { id, isAvailable } = req.body;
    const { token } = req.headers;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.isAdmin) {
      await foodModel.findByIdAndUpdate(id, { isAvailable });
      res.json({ success: true, message: `Item ${isAvailable ? 'enabled' : 'disabled'}` });
    } else {
      res.json({ success: false, message: "Admin access required" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error updating availability" });
  }
};

// Update stock status
const updateStock = async (req, res) => {
  try {
    const { id, quantity, outOfStock } = req.body;
    const { token } = req.headers;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.isAdmin) {
      const updateData = {};
      if (quantity !== undefined) updateData.quantity = quantity;
      if (outOfStock !== undefined) updateData.outOfStock = outOfStock;
      
      await foodModel.findByIdAndUpdate(id, updateData);
      res.json({ success: true, message: "Stock updated successfully" });
    } else {
      res.json({ success: false, message: "Admin access required" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error updating stock" });
  }
};

export { addFood, listFood, removeFood, seedFoodItems, updateInventory, updatePrice, updateImage, toggleAvailability, updateStock };
