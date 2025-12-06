import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

// create vehicles [only admin can action]
const createVehicles = async (req: Request, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }

    const result = await vehiclesServices.createVehicles(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicles created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all vehicles [public]
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getAllVehicles();
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles Found",
        data: result.rows,
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get single vehicle info  [public]
const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getSingleVehicle(
      req.params.vehicleId!
    );
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update vehicle details [only admin can action]
const updateVehicle = async (req: Request, res: Response) => {
  const { role } = req.user!;
  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden access",
    });
  }
  try {
    const result = await vehiclesServices.updateVehicle(
      req.params.vehicleId!,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete vehicle [only admin can action]
const deleteVehicle = async (req: Request, res: Response) => {
  const { role } = req.user!;
  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden access",
    });
  }

  try {
    const result = await vehiclesServices.deleteVehicle(req.params.vehicleId!);

    if (result === null) {
      res.status(404).json({
        success: false,
        message: "Vehicle does not exist",
      });
      return;
    }
    if (result?.rowCount! > 0) {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehiclesControllers = {
  createVehicles,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
