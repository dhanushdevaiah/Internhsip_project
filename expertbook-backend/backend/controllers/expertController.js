const Expert = require("../models/Expert");

/**
 * @desc   Get all experts (with filter, sort, pagination)
 * @route  GET /api/experts
 * @access Public
 */
const getAllExperts = async (req, res, next) => {
  try {
    const { category, minRating, search, sort, page = 1, limit = 9 } = req.query;

    // Build filter object dynamically
    const filter = {};
    if (category)   filter.category  = category;
    if (minRating)  filter.rating    = { $gte: parseFloat(minRating) };
    if (search)     filter.$text     = { $search: search }; // uses text index

    // Build sort object
    const sortOptions = {
      "rating-desc": { rating: -1 },
      "rate-asc":    { hourlyRate: 1 },
      "rate-desc":   { hourlyRate: -1 },
      "newest":      { createdAt: -1 },
    };
    const sortBy = sortOptions[sort] || { rating: -1 }; // default: top rated

    // Pagination math
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [experts, total] = await Promise.all([
      Expert.find(filter).sort(sortBy).skip(skip).limit(parseInt(limit)),
      Expert.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: experts,
    });
  } catch (err) {
    next(err); // passes to global error handler
  }
};

/**
 * @desc   Get single expert by ID
 * @route  GET /api/experts/:id
 * @access Public
 */
const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      const error = new Error("Expert not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: expert });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Create new expert
 * @route  POST /api/experts
 * @access Admin (in production, add auth middleware)
 */
const createExpert = async (req, res, next) => {
  try {
    const expert = await Expert.create(req.body);
    res.status(201).json({ success: true, data: expert });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Update expert
 * @route  PUT /api/experts/:id
 * @access Admin
 */
const updateExpert = async (req, res, next) => {
  try {
    const expert = await Expert.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // return updated document
        runValidators: true, // run schema validators on update
      }
    );

    if (!expert) {
      const error = new Error("Expert not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: expert });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Delete expert
 * @route  DELETE /api/experts/:id
 * @access Admin
 */
const deleteExpert = async (req, res, next) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);

    if (!expert) {
      const error = new Error("Expert not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, message: "Expert deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllExperts,
  getExpertById,
  createExpert,
  updateExpert,
  deleteExpert,
};
