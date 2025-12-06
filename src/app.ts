import express, { Request, Response } from "express"
import initDB from "./config/db"
import { authRoutes } from "./modules/auth/auth.routes"
import { vehiclesRouters } from "./modules/vehicles/vehicles.routers"
const app = express()

// parser
app.use(express.json())

// initializing DB
initDB()

// auth routes
app.use('/api/v1/auth', authRoutes)


// users routes


// vehicles routes
app.use('/api/v1/vehicles', vehiclesRouters)



app.get('/api/v1', (req:Request, res:Response) => {
  res.send('Vehicle Server!')
})



export default app;