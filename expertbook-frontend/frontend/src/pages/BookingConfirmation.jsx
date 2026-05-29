import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";

const BookingConfirmation = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const [booking,  setBooking]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [status,   setStatus]   = useState("");
  const [meetLink, setMeetLink] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        const b = res.data.data;
        setBooking(b);
        setStatus(b.status);
        if (b.meetingLink) setMeetLink(b.meetingLink);
      } catch {
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  // Real-time: listen for status updates for this specific booking
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit("join_booking", id); // join the booking room

    socket.on("booking_status_updated", (data) => {
      if (data.bookingId === id) {
        setStatus(data.status);
        if (data.meetingLink) setMeetLink(data.meetingLink);
      }
    });

    return () => socket.off("booking_status_updated");
  }, [socket, id]);

  const statusConfig = {
    pending:   { label: "Pending Confirmation", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
    confirmed: { label: "Confirmed ✓",           color: "text-green-400",  bg: "bg-green-400/10 border-green-400/30" },
    cancelled: { label: "Cancelled",             color: "text-red-400",    bg: "bg-red-400/10 border-red-400/30" },
    completed: { label: "Completed",             color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/30" },
  };

  if (loading) return (
    <div className="pt-28 max-w-xl mx-auto px-6 space-y-4">
      <div className="skeleton h-48 rounded-2xl" />
      <div className="skeleton h-32 rounded-2xl" />
    </div>
  );

  if (!booking) return (
    <div className="pt-28 text-center">
      <p className="text-brand-slate mb-4">Booking not found.</p>
      <Link to="/experts" className="btn-primary">Browse Experts</Link>
    </div>
  );

  const cfg = statusConfig[status] || statusConfig.pending;
  const expert = booking.expert;

  return (
    <div className="pt-24 min-h-screen pb-24">
      <div className="max-w-xl mx-auto px-6">

        {/* Success icon */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-brand-gold/10 border-2 border-brand-gold/40
                          flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Booking Received!</h1>
          <p className="text-brand-slate">We'll notify you once the expert confirms.</p>
        </div>

        {/* Status badge (updates in real time) */}
        <div className={`card p-4 mb-6 border text-center ${cfg.bg}`}>
          <p className="text-sm text-brand-slate mb-1">Booking Status</p>
          <p className={`font-display text-xl font-semibold ${cfg.color}`}>{cfg.label}</p>
          <p className="text-xs text-brand-slate mt-1">Updates live via WebSocket</p>
        </div>

        {/* Meeting link (shows when confirmed) */}
        {meetLink && (
          <div className="card p-4 mb-6 border border-green-500/30 bg-green-500/5 text-center">
            <p className="text-sm text-brand-slate mb-2">Your Meeting Link</p>
            <a href={meetLink} target="_blank" rel="noopener noreferrer"
              className="text-brand-gold underline text-sm break-all hover:text-brand-gold-light">
              {meetLink}
            </a>
          </div>
        )}

        {/* Booking details */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold mb-2">Booking Details</h2>

          {/* Expert */}
          {expert && (
            <div className="flex items-center gap-3 pb-4 border-b border-brand-border">
              <img src={expert.avatar} alt={expert.name}
                className="w-12 h-12 rounded-xl object-cover border border-brand-border"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=1E2D45&color=D4AF37`; }}
              />
              <div>
                <p className="font-semibold text-sm">{expert.name}</p>
                <p className="text-brand-slate text-xs">{expert.title}</p>
              </div>
            </div>
          )}

          {[
            { label: "Booking ID",    value: `#${booking._id.slice(-8).toUpperCase()}`, mono: true },
            { label: "Your Name",     value: booking.userName },
            { label: "Email",         value: booking.userEmail },
            { label: "Date",          value: new Date(booking.date).toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" }) },
            { label: "Time Slot",     value: booking.timeSlot },
            { label: "Duration",      value: `${booking.duration} hr${booking.duration !== 1 ? "s" : ""}` },
            { label: "Topic",         value: booking.topic },
            { label: "Total Amount",  value: `₹${booking.totalAmount.toLocaleString()}`, gold: true },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-brand-slate">{row.label}</span>
              <span className={`font-medium text-right max-w-[60%] ${row.mono ? "font-mono" : ""} ${row.gold ? "text-brand-gold font-semibold" : "text-brand-text"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <Link to="/experts" className="btn-outline flex-1 text-center text-sm py-3">
            Book Another
          </Link>
          <Link to="/" className="btn-primary flex-1 text-center text-sm py-3">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
