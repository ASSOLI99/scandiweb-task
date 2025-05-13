# Scandiweb Product Management System

A full-stack application for managing products with different attributes (DVD, Book, Furniture).

## Features

- Add new products with specific attributes
- View all products in a list
- Delete multiple products
- Different product types (DVD, Book, Furniture)
- Input validation
- Responsive design

## Technical Stack

### Frontend

- React.js
- TypeScript
- Material-UI for styling
- Axios for API calls

### Backend

- PHP 8.1+
- MySQL/MariaDB
- RESTful API architecture

## Installation

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   composer install
   ```
3. Configure the database in `backend/config/database.php`
4. Import the database schema from `backend/database/schema.sql`
5. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. Start the backend server:

   ```bash
   cd backend
   php -S localhost:8000
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
scandia/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── backend/           # PHP backend application
│   ├── api/
│   ├── config/
│   ├── models/
│   └── database/
└── README.md
```

## API Endpoints

- GET /api/products - Get all products
- POST /api/products - Add a new product
- DELETE /api/products - Delete multiple products

## Database Schema

The database includes the following tables:

- products
- product_attributes
- product_types
