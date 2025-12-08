import { Request, Response } from "express";
import { usersServices } from "./users.services";

// get all users [only admin can action]
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.user!;
    if (role === "admin") {
      const result = await usersServices.getAllUsers();
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: true,
          message: "No Users found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result.rows,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Forbidden access",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update user [user can update only own details without role and admin can any action]
const updateUser = async (req: Request, res: Response) => {
  try {
    const { role } = req?.user!;
    if (role === "customer" && req?.body?.role) {
      res.status(403).json({
        success: false,
        message: "Only admins can update the role.",
      });
      return;
    }

    const result = await usersServices.updateUser(
      req.params.userId!,
      req.body,
      req.user!
    );

    if (result === "not-found") {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (result === "forbidden") {
      res.status(403).json({
        success: false,
        message:
          "Forbidden access 👊, Expected user email does not match the requester's login email.",
      });
      return;
    }

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete user
const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId!;

  const { role } = req.user!;
  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "forbidden access. Only admin can action",
    });
  }

  try {
    const result = await usersServices.deleteUser(userId);

    if (result?.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or have active bookings",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const usersControllers = {
  getAllUsers,
  updateUser,
  deleteUser,
};
