const mongoose = require("mongoose");

/**
 * Booking Schema
 * Represents a session booked by a user with an expert.
 *
 * Key concept – ref: Links documents across collections.
 * populate() replaces the ObjectId with the full document at query time.
 */
const bookingSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",             // References the Expert collection
      required: [true, "Expert reference is required"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    userEmail: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    userPhone: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
    },
    duration: {
      type: Number,  // in hours
      required: [true, "Session duration is required"],
      enum: {
        values: [0.5, 1, 1.5, 2],
        message: "Duration must be 0.5, 1, 1.5, or 2 hours",
      },
    },
    topic: {
      type: String,
      required: [true, "Session topic is required"],
      maxlength: [300, "Topic cannot exceed 300 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "cancelled", "completed"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    meetingLink: {
      type: String, // populated when booking is confirmed
    },
  },
  {
    timestamps: true,
  }
);

// Useful compound index: query bookings by expert + status
bookingSchema.index({ expert: 1, status: 1 });
bookingSchema.index({ userEmail: 1 });
bookingSchema.index({ date: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
