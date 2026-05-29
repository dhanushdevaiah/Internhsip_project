const Booking = require("../models/Booking");
const Expert  = require("../models/Expert");

/**
 * @desc   Create a new booking
 * @route  POST /api/bookings
 * @access Public
 */
const createBooking = async (req, res, next) => {
  try {
    const { expertId, userName, userEmail, userPhone, date, timeSlot, duration, topic, notes } = req.body;

    // Fetch expert to calculate total amount
    const expert = await Expert.findById(expertId);
    if (!expert) {
      const err = new Error("Expert not found");
      err.statusCode = 404;
      return next(err);
    }

    if (!expert.isAvailable) {
      const err = new Error("This expert is currently unavailable");
      err.statusCode = 400;
      return next(err);
    }

    // Check for conflicting booking (same expert, same date, same time slot)
    const conflict = await Booking.findOne({
      expert: expertId,
      date: new Date(date),
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });

    if (conflict) {
      const err = new Error("This time slot is already booked. Please choose another.");
      err.statusCode = 409;
      return next(err);
    }

    const totalAmount = expert.hourlyRate * duration;

    const booking = await Booking.create({
      expert: expertId,
      userName,
      userEmail,
      userPhone,
      date,
      timeSlot,
      duration,
      topic,
      notes,
      totalAmount,
    });

    // Populate expert details before sending response
    await booking.populate("expert", "name title avatar");

    // ─── Real-time: notify via Socket.io ───
    const io = req.app.get("io");
    if (io) {
      // Emit to a general admin room
      io.emit("new_booking", {
        bookingId: booking._id,
        expertName: expert.name,
        userName,
        date,
        timeSlot,
      });
    }

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get all bookings (admin) or by user email (user)
 * @route  GET /api/bookings
 * @access Public (filter by email for user view)
 */
const getAllBookings = async (req, res, next) => {
  try {
    const { email, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (email)  filter.userEmail = email.toLowerCase();
    if (status) filter.status    = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("expert", "name title avatar category hourlyRate")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get single booking by ID
 * @route  GET /api/bookings/:id
 * @access Public
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "expert",
      "name title avatar hourlyRate"
    );

    if (!booking) {
      const err = new Error("Booking not found");
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Update booking status
 * @route  PATCH /api/bookings/:id/status
 * @access Admin
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

    if (!allowedStatuses.includes(status)) {
      const err = new Error("Invalid status value");
      err.statusCode = 400;
      return next(err);
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("expert", "name title");

    if (!booking) {
      const err = new Error("Booking not found");
      err.statusCode = 404;
      return next(err);
    }

    // If confirmed, generate a mock meeting link
    if (status === "confirmed" && !booking.meetingLink) {
      booking.meetingLink = `https://meet.expertbooking.com/session/${booking._id}`;
      await booking.save();
    }

    // Real-time status update notification
    const io = req.app.get("io");
    if (io) {
      io.to(booking._id.toString()).emit("booking_status_updated", {
        bookingId: booking._id,
        status: booking.status,
        meetingLink: booking.meetingLink,
      });
    }

    // Update expert's completed sessions count
    if (status === "completed") {
      await Expert.findByIdAndUpdate(booking.expert._id, {
        $inc: { completedSessions: 1 },
      });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Cancel a booking
 * @route  DELETE /api/bookings/:id
 * @access Public (user can cancel their own)
 */
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      const err = new Error("Booking not found");
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({ success: true, message: "Booking cancelled", data: booking });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
