import { Pool } from "pg";
import config from ".";

const pool = new Pool({ connectionString: config.connecting_str });

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        CHECK (email = lower(email)),
        password TEXT NOT NULL,
        CHECK (char_length(password) >= 6),
        phone VARCHAR(20) NOT NULL,
        role TEXT,
        CHECK (role IN ('admin', 'customer'))

        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(150) NOT NULL,
        type VARCHAR(50),
        CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number TEXT UNIQUE NOT NULL,
        daily_rent_price NUMERIC NOT NULL,
        CHECK (daily_rent_price > 0),
        available_status VARCHAR(20),
        CHECK (available_status IN ('available', 'booked'))
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES Users(id),
        vehicle_id INT REFERENCES Vehicles(id),
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        CHECK (rent_end_date> rent_start_date),
        total_price NUMERIC NOT NULL,
        CHECK (total_price > 0),
        status VARCHAR(20),
        CHECK (status IN ('active', 'cancelled', 'returned'))
        )
        `);
};

export default initDB;
