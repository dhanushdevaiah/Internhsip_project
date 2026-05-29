import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const TIME_SLOTS = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"];
const DURATIONS  = [
  { value: 0.5, label: "30 min" },
  { value: 1,   label: "1 hr"   },
  { value: 1.5, label: "1.5 hr" },
  { value: 2,   label: "2 hr"   },
];

const InputField = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-brand-text mb-2">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const BookingPage = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();

  const [expert,    setExpert]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [submitting,setSubmitting]= useState(false);
  const [errors,    setErrors]    = useState({});
  const [apiError,  setApiError]  = useState("");

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const [form, setForm] = useState({
    userName:  "",
    userEmail: "",
    userPhone: "",
    date:      "",
    timeSlot:  "",
    duration:  1,
    topic:     "",
    notes:     "",
  });

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const res = await api.get(`/experts/${expertId}`);
        setExpert(res.data.data);
      } catch {
        navigate("/experts");
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
  }, [expertId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "duration" ? parseFloat(value) : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  // Client-side validation
  const validate = () => {
    const errs = {};
    if (!form.userName.trim())  errs.userName  = "Name is required";
    if (!form.userEmail.trim()) errs.userEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail)) errs.userEmail = "Enter a valid email";
    if (!form.date)             errs.date      = "Please select a date";
    if (!form.timeSlot)         errs.timeSlot  = "Please select a time slot";
    if (!form.topic.trim())     errs.topic     = "Please describe your session topic";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setSubmitting(true);
      const res = await api.post("/bookings", { ...form, expertId });
      navigate(`/booking-confirmation/${res.data.data._id}`);
    } catch (err) {
      setApiError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalCost = expert ? (expert.hourlyRate * form.duration).toLocaleString() : "–";

  if (loading) return (
    <div className="pt-28 max-w-2xl mx-auto px-6">
      <div className="skeleton h-10 w-1/2 mb-6" />
      <div className="skeleton h-96 rounded-2xl" />
    </div>
  );

  return (
    <div className="pt-24 min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-brand-gold font-mono text-xs uppercase tracking-widest mb-2">Booking</p>
          <h1 className="section-title mb-1">Book a Session</h1>
          <span className="gold-line" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── FORM ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-8 space-y-6">

              <h2 className="font-display text-lg font-semibold border-b border-brand-border pb-4">
                Your Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField label="Full Name *" error={errors.userName}>
                  <input name="userName" value={form.userName} onChange={handleChange}
                    className={`input-field ${errors.userName ? "border-red-500/60" : ""}`}
                    placeholder="Dhanush Kumar" />
                </InputField>
                <InputField label="Email Address *" error={errors.userEmail}>
                  <input name="userEmail" value={form.userEmail} onChange={handleChange}
                    type="email" className={`input-field ${errors.userEmail ? "border-red-500/60" : ""}`}
                    placeholder="dhanush@email.com" />
                </InputField>
              </div>

              <InputField label="Phone Number (optional)" error={errors.userPhone}>
                <input name="userPhone" value={form.userPhone} onChange={handleChange}
                  type="tel" className="input-field" placeholder="+91 98765 43210" />
              </InputField>

              <h2 className="font-display text-lg font-semibold border-b border-brand-border pb-4 !mt-8">
                Session Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField label="Preferred Date *" error={errors.date}>
                  <input name="date" value={form.date} onChange={handleChange}
                    type="date" min={today}
                    className={`input-field ${errors.date ? "border-red-500/60" : ""}`} />
                </InputField>
                <InputField label="Time Slot *" error={errors.timeSlot}>
                  <select name="timeSlot" value={form.timeSlot} onChange={handleChange}
                    className={`input-field ${errors.timeSlot ? "border-red-500/60" : ""}`}>
                    <option value="">Select time…</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </InputField>
              </div>

              {/* Duration */}
              <InputField label="Duration *" error="">
                <div className="grid grid-cols-4 gap-3">
                  {DURATIONS.map((d) => (
                    <button key={d.value} type="button"
                      onClick={() => setForm((prev) => ({ ...prev, duration: d.value }))}
                      className={`py-3 rounded-xl border text-sm font-mono transition-all ${
                        form.duration === d.value
                          ? "bg-brand-gold text-brand-dark border-brand-gold font-bold"
                          : "border-brand-border text-brand-slate hover:border-brand-gold/40"
                      }`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </InputField>

              <InputField label="Session Topic *" error={errors.topic}>
                <input name="topic" value={form.topic} onChange={handleChange}
                  className={`input-field ${errors.topic ? "border-red-500/60" : ""}`}
                  placeholder="e.g., Career guidance, System design review, Fundraising strategy…" />
              </InputField>

              <InputField label="Additional Notes (optional)" error="">
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  rows={3} className="input-field resize-none"
                  placeholder="Any background context or specific questions you'd like to discuss…" />
              </InputField>

              {/* API error */}
              {apiError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                  {apiError}
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Confirming…
                  </span>
                ) : `Confirm Booking · ₹${totalCost}`}
              </button>
            </form>
          </div>

          {/* ── SIDEBAR: Expert Summary ───────────────────────────────────── */}
          {expert && (
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-6 sticky top-24">
                <h3 className="font-display font-semibold mb-4 text-brand-text">Booking Summary</h3>

                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-brand-border">
                  <img src={expert.avatar} alt={expert.name}
                    className="w-12 h-12 rounded-xl object-cover border border-brand-border"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=1E2D45&color=D4AF37`; }}
                  />
                  <div>
                    <p className="font-semibold text-sm">{expert.name}</p>
                    <p className="text-brand-slate text-xs">{expert.title}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {[
                    { label: "Rate",        value: `₹${expert.hourlyRate.toLocaleString()}/hr` },
                    { label: "Duration",    value: DURATIONS.find((d) => d.value === form.duration)?.label },
                    { label: "Date",        value: form.date || "–" },
                    { label: "Time",        value: form.timeSlot || "–" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-brand-slate">{row.label}</span>
                      <span className="font-mono font-medium">{row.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t border-brand-border">
                    <span className="text-brand-text font-semibold">Total</span>
                    <span className="font-mono text-brand-gold font-bold text-lg">₹{totalCost}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
