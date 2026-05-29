import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const ExpertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert,  setExpert]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/experts/${id}`);
        setExpert(res.data.data);
      } catch (err) {
        setError(err.response?.status === 404 ? "Expert not found." : "Failed to load expert.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
  }, [id]);

  if (loading) return (
    <div className="pt-28 max-w-5xl mx-auto px-6 space-y-6">
      <div className="skeleton h-48 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
        </div>
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    </div>
  );

  if (error) return (
    <div className="pt-28 text-center">
      <p className="text-brand-slate mb-4">{error}</p>
      <button onClick={() => navigate("/experts")} className="btn-primary">← Back to Experts</button>
    </div>
  );

  const { name, title, category, bio, expertise, hourlyRate, rating,
          totalReviews, experience, avatar, isAvailable,
          completedSessions, languages, availableSlots } = expert;

  const starFill = (star) => star <= Math.round(rating) ? "text-brand-gold" : "text-brand-border";

  return (
    <div className="pt-24 min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-6">

        {/* Breadcrumb */}
        <nav className="text-xs text-brand-slate mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-brand-gold">Home</Link>
          <span>/</span>
          <Link to="/experts" className="hover:text-brand-gold">Experts</Link>
          <span>/</span>
          <span className="text-brand-text">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Main Info ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile card */}
            <div className="card p-8">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img src={avatar} alt={name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-border"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E2D45&color=D4AF37`; }}
                  />
                  <span className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-2 border-brand-card
                    ${isAvailable ? "bg-green-400" : "bg-red-400"}`} />
                </div>
                <div className="flex-1">
                  <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">{name}</h1>
                  <p className="text-brand-slate mb-3">{title}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="badge border-brand-gold/40 text-brand-gold text-xs">{category}</span>
                    <span className={`text-xs font-medium ${isAvailable ? "text-green-400" : "text-red-400"}`}>
                      {isAvailable ? "● Available" : "● Unavailable"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className={`w-4 h-4 ${starFill(s)}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-brand-slate font-mono">{rating.toFixed(1)} · {totalReviews} reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Experience",   value: `${experience} yrs` },
                { label: "Sessions",     value: completedSessions   },
                { label: "Languages",    value: (languages || []).join(", ") || "English" },
              ].map((s) => (
                <div key={s.label} className="card p-4 text-center">
                  <div className="font-display text-xl font-bold text-brand-gold">{s.value}</div>
                  <div className="text-brand-slate text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="card p-8">
              <h2 className="font-display text-xl font-semibold mb-4">About</h2>
              <p className="text-brand-slate leading-relaxed">{bio}</p>
            </div>

            {/* Expertise */}
            <div className="card p-8">
              <h2 className="font-display text-xl font-semibold mb-4">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {expertise.map((skill) => (
                  <span key={skill}
                    className="bg-brand-dark border border-brand-border text-brand-text text-sm px-4 py-2 rounded-lg hover:border-brand-gold/40 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            {availableSlots?.length > 0 && (
              <div className="card p-8">
                <h2 className="font-display text-xl font-semibold mb-4">Weekly Availability</h2>
                <div className="space-y-3">
                  {availableSlots.map((slot, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-brand-border last:border-0">
                      <span className="font-medium text-brand-text">{slot.day}</span>
                      <span className="font-mono text-sm text-brand-gold">
                        {slot.startTime} – {slot.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Booking Widget ────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="text-center border-b border-brand-border pb-6 mb-6">
                <span className="text-3xl font-display font-bold text-brand-gold">
                  ₹{hourlyRate.toLocaleString()}
                </span>
                <span className="text-brand-slate text-sm"> / hour</span>
                <p className="text-xs text-brand-slate mt-2">No hidden fees</p>
              </div>

              <div className="space-y-3 text-sm mb-6">
                {[
                  { icon: "✓", text: "Verified professional" },
                  { icon: "✓", text: "30-min free intro call" },
                  { icon: "✓", text: "Money-back guarantee" },
                  { icon: "✓", text: "HD video session" },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-2 text-brand-slate">
                    <span className="text-brand-gold font-bold">{f.icon}</span>
                    {f.text}
                  </div>
                ))}
              </div>

              {isAvailable ? (
                <Link to={`/book/${id}`} className="btn-primary w-full block text-center text-sm py-4">
                  Book a Session
                </Link>
              ) : (
                <button disabled
                  className="w-full py-4 rounded-xl bg-brand-border text-brand-slate text-sm cursor-not-allowed">
                  Currently Unavailable
                </button>
              )}

              <p className="text-center text-xs text-brand-slate mt-4">
                Typically responds within 2 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetailPage;
