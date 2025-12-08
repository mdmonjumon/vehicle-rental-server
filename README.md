
# Project Title : Vehicle Rental System
### Live URL : https://vehicle-rental-server-one.vercel.app/api/v1/

## Features:
- Admin - Full system access to manage vehicles, users and all bookings
- Customer - Can register, view vehicles, create/manage own bookings

## Technology Stack:
- Backend --->	Node.js + Express.js + TypeScript
- Database --->	PostgreSQL

## Setup & Usage Instructions:

#### Authentication:

| Method | Endpoint     | Access  | Descripton |
| :-------- | :------- | :------------|  :-------|
| POST | /api/v1/auth/signup | Public | Register New User |
| POST | /api/v1/auth/signin | Public | Login and receive JWT token |


#### Vehicles:

| Method | Endpoint     | Access  | Description |
| :-------- | :------- | :------------|  :-------|
| POST | /api/v1/vehicles | Admin only | View all vehicles |
| GET | /api/v1/vehicles | Public | View all vehicles in the system |
| GET | /api/v1/vehicles/:vehicleId | Public | View specific vehicle details |
| PUT | /api/v1/vehicles/:vehicleId | Admin only | Update vehicle details |
| DELETE | /api/v1/vehicles/:vehicleId | Admin only | Delete vehicle (only if no active bookings exist) |

#### Users:
| Method | Endpoint     | Access  | Description |
| :-------- | :------- | :------------|  :-------|
| GET | /api/v1/users | Admin only | View all users |
| PUT | /api/v1/users/:userId | Admin or Own | Admin: Update any user's role or details <br> Customer:Update own profile only |
| DELETE | /api/v1/users/:userId | Admin only | Delete user (only if no active bookings exist) |

#### Bookings:
| Method | Endpoint     | Access  | Descripton |
| :-------- | :------- | :------------|  :-------|
| POST | /api/v1/bookings | Customer or Admin | Create booking with start/end dates |
| GET | /api/v1/bookings | Role-based | Admin: View all bookings <br> Customer: View own bookings only |
| PUT | /api/v1/bookings/:bookingId	 | Role-based | Customer: Cancel booking (before start date only) <br> Admin: Mark as "returned" (updates vehicle to "available" |

