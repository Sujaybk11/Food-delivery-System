#!/bin/bash

echo "Building Food Delivery System..."

echo ""
echo "Building Backend..."
docker build -t food-delivery-backend ./backend

echo ""
echo "Building Frontend..."
docker build -t food-delivery-frontend ./frontend

echo ""
echo "Building Admin..."
docker build -t food-delivery-admin ./admin

echo ""
echo "All images built successfully!"
echo ""
echo "To run the application:"
echo "docker-compose up"
echo ""
echo "To run in production mode:"
echo "docker-compose -f docker-compose.prod.yml up"