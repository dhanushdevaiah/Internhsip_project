const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllExperts,
  getExpertById,
  createExpert,
  updateExpert,
  deleteExpert,
} = require("../controllers/expertController");

const router = express.Router();

/**
 * Validation middleware factory
 * Intercepts after express-validator rules run
 */
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

// ─── Reusable validation rules ────────────────────────────────────────────────
const expertValidationRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("category")
    .isIn(["Technology","Finance","Legal","Health","Marketing","Design","Business","Education"])
    .withMessage("Invalid category"),
  body("hourlyRate").isNumeric().withMessage("Hourly rate must be a number"),
  body("experience").isNumeric().withMessage("Experience must be a number"),
  body("bio").trim().notEmpty().withMessage("Bio is required"),
];

// ─── Routes ───────────────────────────────────────────────────────────────────
router.get("/",    getAllExperts);
router.get("/:id", getExpertById);
router.post("/",   expertValidationRules, validate, createExpert);
router.put("/:id", expertValidationRules, validate, updateExpert);
router.delete("/:id", deleteExpert);

module.exports = router;
