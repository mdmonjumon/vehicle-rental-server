import express from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import verifyJPermission from "../../middleware/verifyPermissions";

const router = express.Router();

// create vehicles [only admin can action]
router.post("/", verifyJPermission(), vehiclesControllers.createVehicles);

// get all vehicles [public]
router.get("/", vehiclesControllers.getAllVehicles);

// get single vehicle info  [public]
router.get("/:vehicleId", vehiclesControllers.getSingleVehicle);

// update vehicle details [only admin can action]
router.put("/:vehicleId", verifyJPermission(), vehiclesControllers.updateVehicle);

// delete vehicle [only admin can action]
router.delete("/:vehicleId", verifyJPermission(), vehiclesControllers.deleteVehicle);

export const vehiclesRouters = router;
