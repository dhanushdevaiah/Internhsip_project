const mongoose = require("mongoose");

/**
 * Expert Schema
 * Represents a professional available for booking.
 *
 * Key Mongoose concepts:
 * - enum: restricts field to allowed values (data integrity)
 * - required + trim: mandatory + strips whitespace
 * - min/max: numeric range validation
 * - timestamps: auto adds createdAt & updatedAt
 */
const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Expert name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    title: {
      type: String,
      required: [true, "Professional title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Technology",
          "Finance",
          "Legal",
          "Health",
          "Marketing",
          "Design",
          "Business",
          "Education",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },
    expertise: [
      {
        type: String,
        trim: true,
      },
    ],
    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
      min: [0, "Rate cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    experience: {
      type: Number, // years of experience
      required: [true, "Years of experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?background=random",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availableSlots: [
      {
        day: {
          type: String,
          enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        },
        startTime: String, // "09:00"
        endTime: String,   // "17:00"
      },
    ],
    languages: [{ type: String }],
    linkedIn: { type: String },
    completedSessions: { type: Number, default: 0 },
  },
  {
    timestamps: true, // auto-manages createdAt and updatedAt
  }
);

// Index for fast search/filter queries
expertSchema.index({ category: 1, rating: -1 });
expertSchema.index({ name: "text", bio: "text", expertise: "text" }); // text search

module.exports = mongoose.model("Expert", expertSchema);
