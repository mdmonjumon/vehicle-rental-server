import { Request, Response } from "express";
import { bookingsServices } from "./bookings.services";

const createBooking = async (req: Request, res: Response) => {
  const { rent_start_date, rent_end_date } = req.body;
  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);

  const { role } = req?.user!;

  if (role !== "admin" && role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Forbidden access",
    });
  }

  if (endDate.getTime() < startDate.getTime()) {
    return res.status(400).json({
      success: false,
      message: "Return date must be greater than booking date.",
    });
  }

  try {
    const result = await bookingsServices.createBooking(req.body);
    if (result === "unavailable") {
      return res.status(404).json({
        success: false,
        message: "Vehicle unavailable",
      });
    }
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get bookings
const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsServices.getBookings(req.user!);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: true,
        message: "No bookings found",
        data: result?.rows[0],
      });
    }

    res.status(200).json({
      success: true,
      message: "Your bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update booking
const updateBooking = async (req: Request, res: Response) => {
  const { status } = req?.body;
  const { role } = req?.user!;
  try {
    const result = await bookingsServices.updateBooking({
      ...req?.user,
      bookingId: req?.params?.bookingId,
      ...req?.body,
    });
    res.status(200).json({
      success: true,
      message: "successful",
    });
  } catch (error: any) {
    res.send(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingsController = {
  createBooking,
  getBookings,
  updateBooking,
};
