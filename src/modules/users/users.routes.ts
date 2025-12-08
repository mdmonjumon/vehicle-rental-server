import express from "express";
import { usersControllers } from "./users.controllers";
import verifyJPermission from "../../middleware/verifyPermissions";

const router = express.Router();

// get all users
router.get("/", verifyJPermission(), usersControllers.getAllUsers);

// update user
router.put("/:userId", verifyJPermission(), usersControllers.updateUser);

router.delete("/:userId", verifyJPermission(), usersControllers.deleteUser)

export const usersRouters = router;
