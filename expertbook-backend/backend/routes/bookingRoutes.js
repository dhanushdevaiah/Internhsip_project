const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/bookingController");

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Validation rules ─────────────────────────────────────────────────────────
const bookingValidationRules = [
  body("expertId").notEmpty().withMessage("Expert ID is required"),
  body("userName").trim().notEmpty().withMessage("Your name is required"),
  body("userEmail").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("date").isISO8601().withMessage("Valid date is required"),
  body("timeSlot").notEmpty().withMessage("Time slot is required"),
  body("duration")
    .isIn([0.5, 1, 1.5, 2])
    .withMessage("Duration must be 0.5, 1, 1.5, or 2 hours"),
  body("topic").trim().notEmpty().withMessage("Session topic is required"),
];

// ─── Routes ───────────────────────────────────────────────────────────────────
router.get("/",    getAllBookings);
router.get("/:id", getBookingById);
router.post("/",   bookingValidationRules, validate, createBooking);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", cancelBooking);

module.exports = router;
