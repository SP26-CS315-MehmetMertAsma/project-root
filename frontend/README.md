# Restaurant POS System

## Team Members
- Mert Asma
- Jayden Loring

## Overview

This project is a full-stack restaurant order management system built to simulate how waiters manage tables and orders in a real restaurant.

The system allows users to select tables, add menu items, manage orders, and calculate totals dynamically. It is designed to feel like a simple tablet-based POS (Point of Sale) system.

## Technologies Used

- Frontend: React (Vite)
- Backend: Node.js + Express
- Containerization: Docker & Docker Compose

## Features

### Table Management
- 12 tables are automatically generated
- Each table shows:
  - Number of active orders
  - Total bill amount
  - Status (Available / Active)

### Order Management
- Select a table and add menu items directly
- Each order includes:
  - Item name
  - Quantity
  - Total price
- Delete individual orders
- Clear all orders for a table (Close Table)

### Menu System
- Predefined menu with categories:
  - Wraps
  - Turkish Grill
  - Desserts
  - Drinks
- Menu items display name, category, and price

### Dashboard
- Table-based layout (POS style)
- Active tables counter
- Total open revenue across all tables
- Real-time updates after every action

## How to Run the Project

Make sure Docker is installed and running.

### Step 1: Navigate to project folder
cd project-root

### Step 2: Run the app
docker compose up --build

### Step 3: Open in browser
http://localhost:5173

## API Endpoints

### Tables
- GET /api/tables

### Menu
- GET /api/menu
- POST /api/menu

### Orders
- GET /api/orders
- POST /api/orders
- DELETE /api/orders/:id

### Table Orders
- GET /api/tables/:tableNumber/orders
- DELETE /api/tables/:tableNumber/orders

## Project Structure

project-root/
├── backend/
├── frontend/
└── docker-compose.yml

## Notes

- Data is stored in memory (no database)
- Refreshing resets all orders
- Built for learning full-stack + Docker

## Conclusion

This project demonstrates a full-stack application using React, Express, and Docker, simulating a real restaurant POS system.