import express from 'express'
import { bookingsController } from './bookings.controllers'
import verifyJPermission from '../../middleware/verifyPermissions'

const router = express.Router()

// create bookings
router.post('/', verifyJPermission(), bookingsController.createBooking)

// get bookings
router.get('/', verifyJPermission(), bookingsController.getBookings)

// update booking
router.put('/:bookingId', verifyJPermission(), bookingsController.updateBooking)


export const bookingsRouter= router