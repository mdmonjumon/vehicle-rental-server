import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleInfo = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  const vehicleStatus = vehicleInfo?.rows[0]?.availability_status;

  if (vehicleInfo.rows.length === 0 || vehicleStatus !== "available") {
    return "unavailable";
  }

  const { daily_rent_price, vehicle_name } = vehicleInfo?.rows[0];
  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);

  // total price
  const totalPrice =
    ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) *
    daily_rent_price;

  const vehicle = {
    vehicle_name,
    daily_rent_price,
  };

  // add new column in bookings table
  await pool.query(
    `ALTER TABLE bookings ADD COLUMN IF NOT EXISTS vehicle JSONB`
  );
  const result = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, vehicle) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [customer_id, vehicle_id, startDate, endDate, totalPrice, "active", vehicle]
  );

  if (result.rows.length > 0) {
    await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, [
      "booked",
      vehicle_id,
    ]);
  }

  return result;
};

// get bookings
const getBookings = async (payload: Record<string, unknown>) => {
  const { role, email } = payload;
  let query = `SELECT * FROM bookings`;
  let queryParameter: any[] = [];

  if (role === "customer") {
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    const id = result?.rows[0]?.id;
    query = query + ` WHERE customer_id=$1`;
    queryParameter.push(id);
  }

  const result = await pool.query(query, queryParameter);
  return result;
};

// update booking
const updateBooking = async (payload: Record<string, unknown>) => {
  const { role, status, bookingId, email } = payload;
  if (role === "admin") {
    const result = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2`,
      [status, bookingId]
    );
    return result;
  }

  // booking info
  const booking = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1`,
    [bookingId]
  );
  // user info
  const userInfo = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (userInfo?.rows[0]?.id !== booking?.rows[0]?.customer_id) {
    return "forbidden";
  }

  //rent start date
  const bookingStartDate = new Date(
    booking?.rows[0]?.rent_start_date
  ).getTime();
  const today = new Date().getTime();

  // checking booking started or not
  if (today > bookingStartDate) {
    return "rent started";
  }

  const result = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, bookingId]
  );
  if (result.rows.length > 0) {
    const vehicleId = result?.rows[0]?.vehicle_id;
   const vehicle = await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
      ["available", vehicleId]
    );
  }
  return result;
};

export const bookingsServices = {
  createBooking,
  getBookings,
  updateBooking,
};
