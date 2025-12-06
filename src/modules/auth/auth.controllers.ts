import { Request, Response } from "express";
import { authServices } from "./auth.services";


// register user
const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signupUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signin user
const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.userLogin(email, password);
    if (!result) {
      res.status(500).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authControllers = {
  signupUser,
  userLogin,
};
