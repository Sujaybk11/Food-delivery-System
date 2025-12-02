# Food Delivery App - MERN Stack

A complete food delivery application built with MongoDB, Express.js, React, and Node.js.

## Features

### User Features
- 🔐 User Authentication (Login/Register)
- 🍕 Browse Food Items by Category
- 🛒 Add/Remove Items to Cart
- 💵 Cash on Delivery Payment
- ⏰ Order Cancellation (2-minute window)
- 📱 Real-time Order Tracking
- 📋 Order History

### Admin Features
- 👨‍💼 Admin Authentication
- ➕ Add/Edit/Delete Food Items
- 📸 Update Food Item Images
- 📦 Inventory Management
- 👥 Customer Management
- 📊 Order Management
- ✅ Order Status Updates

## Tech Stack

- **Frontend**: React.js, CSS3, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer
- **State Management**: React Context API

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Food-Delivery-main
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Install Admin Dependencies**
```bash
cd ../admin
npm install
```

5. **Environment Configuration**

Create `.env` files in each directory:

**Backend (.env)**
```
MONGO_URL=mongodb://localhost:27017/food_delivery
JWT_SECRET=your_super_secret_jwt_key_food_delivery_2024
SALT=10
PORT=4000
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:4000
```

**Admin (.env)**
```
VITE_API_URL=http://localhost:4000
```

6. **Start the Application**

```bash
# Start Backend (Terminal 1)
cd backend
npm start

# Start Frontend (Terminal 2)
cd frontend
npm run dev

# Start Admin Panel (Terminal 3)
cd admin
npm run dev
```

## Usage

- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5176
- **Backend API**: http://localhost:4000

### Default Admin Credentials
- Email: admin@fooddelivery.com
- Password: admin123

## Project Structure

```
Food-Delivery-main/
├── backend/           # Express.js API
├── frontend/          # React.js User Interface
├── admin/            # React.js Admin Panel
├── .gitignore        # Git ignore rules
└── README.md         # Project documentation
```

## Key Features Implemented

### Order Management
- Real-time order tracking with 15-minute delivery window
- 2-minute cancellation window for users
- Dynamic order status updates
- Cash on Delivery payment system

### Inventory System
- Stock quantity tracking
- Out-of-stock management
- Price editing capabilities
- Image upload and editing

### Authentication & Security
- JWT-based authentication
- Admin role-based access control
- Secure password hashing
- Session persistence

## API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

### Food Items
- `GET /api/food/list` - Get all food items
- `POST /api/food/add` - Add food item (Admin)
- `POST /api/food/update-image` - Update food image (Admin)

### Orders
- `POST /api/order/place-cod` - Place COD order
- `POST /api/order/cancel` - Cancel order
- `GET /api/order/list` - Get all orders (Admin)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@fooddelivery.com or create an issue in the repository.