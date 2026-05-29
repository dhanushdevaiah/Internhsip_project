import React from "react";
import { Link } from "react-router-dom";

/**
 * ExpertCard – Reusable card component
 * Displays a summary of an expert with key info and a CTA.
 *
 * Props:
 *  expert {Object} – the expert document from MongoDB
 *
 * Key concept: Controlled, single-responsibility component.
 * It only renders; it doesn't fetch data.
 */
const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-brand-gold" : "text-brand-border"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462
                   c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755
                   1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1
                   1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const CategoryBadge = ({ category }) => {
  const colors = {
    Technology: "border-blue-500/40   text-blue-400",
    Finance:    "border-green-500/40  text-green-400",
    Legal:      "border-purple-500/40 text-purple-400",
    Health:     "border-red-500/40    text-red-400",
    Marketing:  "border-orange-500/40 text-orange-400",
    Design:     "border-pink-500/40   text-pink-400",
    Business:   "border-yellow-500/40 text-yellow-400",
    Education:  "border-teal-500/40   text-teal-400",
  };
  return (
    <span className={`badge ${colors[category] || "border-brand-border text-brand-slate"}`}>
      {category}
    </span>
  );
};

const ExpertCard = ({ expert = {}, index = 0 }) => {
  const {
    _id,
    name = "Unknown Expert",
    title = "Expert",
    category = "Business",
    bio = "No bio available.",
    expertise = [],
    hourlyRate = 0,
    rating = 0,
    totalReviews = 0,
    experience = 0,
    avatar = "https://ui-avatars.com/api/?background=1E2D45&color=D4AF37&name=Expert",
    isAvailable = false,
    completedSessions = 0,
  } = expert;

  return (
    <article
      className="card p-6 flex flex-col gap-4 group animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header row */}
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={avatar}
            alt={name}
            className="w-14 h-14 rounded-xl object-cover border border-brand-border
                       group-hover:border-brand-gold/40 transition-colors duration-300"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E2D45&color=D4AF37`; }}
          />
          {/* Availability dot */}
          <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-brand-card
            ${isAvailable ? "bg-green-400" : "bg-red-400"}`}
            title={isAvailable ? "Available" : "Unavailable"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-brand-text truncate group-hover:text-brand-gold
                         transition-colors duration-200">
            {name}
          </h3>
          <p className="text-brand-slate text-sm truncate">{title}</p>
          <CategoryBadge category={category} />
        </div>
      </div>

      {/* Bio */}
      <p className="text-brand-slate text-sm leading-relaxed line-clamp-2">{bio}</p>

      {/* Expertise tags */}
      <div className="flex flex-wrap gap-1.5">
        {expertise.slice(0, 4).map((skill) => (
          <span key={skill}
            className="text-xs bg-brand-dark border border-brand-border text-brand-slate px-2 py-0.5 rounded-md">
            {skill}
          </span>
        ))}
        {expertise.length > 4 && (
          <span className="text-xs text-brand-slate px-2 py-0.5">+{expertise.length - 4} more</span>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between pt-2 border-t border-brand-border">
        <div className="flex items-center gap-1.5">
          <StarRating rating={rating} />
          <span className="text-xs text-brand-slate font-mono">
            {rating.toFixed(1)} ({totalReviews})
          </span>
        </div>
        <div className="text-right">
          <span className="text-brand-gold font-mono font-semibold">₹{hourlyRate.toLocaleString()}</span>
          <span className="text-brand-slate text-xs">/hr</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-brand-slate">
          <span className="text-brand-text font-medium">{experience}yr</span> exp ·{" "}
          <span className="text-brand-text font-medium">{completedSessions}</span> sessions
        </div>

        <div className="flex gap-2">
          <Link
            to={`/experts/${_id}`}
            className="btn-outline text-xs py-1.5 px-3"
          >
            Profile
          </Link>
          {isAvailable && (
            <Link
              to={`/book/${_id}`}
              className="btn-primary text-xs py-1.5 px-3"
            >
              Book
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ExpertCard;
