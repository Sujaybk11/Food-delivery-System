# Docker Setup Guide - Food Delivery System

## Prerequisites
- Docker Desktop installed
- Git client
- 8GB+ RAM recommended

## Quick Start

1. **Clone and navigate to project**
```bash
git clone <your-repo-url>
cd Food-delivery-System
```

2. **Build and run all services**
```bash
docker-compose up --build
```

3. **Access the applications**
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5176
- Backend API: http://localhost:4000
- MongoDB: localhost:27017

## Individual Service Commands

### Build specific service
```bash
docker-compose build backend
docker-compose build frontend
docker-compose build admin
```

### Run specific service
```bash
docker-compose up backend
docker-compose up frontend
docker-compose up admin
```

### View logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs admin
```

## Production Build

For production deployment, create a `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: food-delivery-mongo-prod
    restart: always
    environment:
      MONGO_INITDB_DATABASE: food_delivery
    volumes:
      - mongo_data:/data/db

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    container_name: food-delivery-backend-prod
    ports:
      - "4000:4000"
    environment:
      - MONGO_URL=mongodb://mongodb:27017/food_delivery
      - JWT_SECRET=${JWT_SECRET}
      - SALT=10
      - PORT=4000
      - NODE_ENV=production
    depends_on:
      - mongodb
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: food-delivery-frontend-prod
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

volumes:
  mongo_data:
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
```bash
# Check what's using the ports
netstat -tulpn | grep :4000
netstat -tulpn | grep :5173
netstat -tulpn | grep :5176
```

2. **Clean rebuild**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

3. **Reset database**
```bash
docker-compose down -v
docker-compose up --build
```

### Useful Commands

```bash
# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# View running containers
docker ps

# Access container shell
docker exec -it food-delivery-backend sh
docker exec -it food-delivery-mongo mongosh

# View container logs
docker logs food-delivery-backend
```

## Environment Variables

Make sure to set these in your `.env` files or docker-compose environment section:

- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `VITE_API_URL`: Backend API URL for frontend/admin