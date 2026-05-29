import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

/**
 * Navbar – Persistent top navigation
 * Features: active link highlighting, scroll-aware background, mobile menu,
 * live socket connection indicator.
 */
const Navbar = () => {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [notification, setNotification] = useState(null);
  const location = useLocation();
  const { socket, isConnected } = useSocket();

  // Scroll listener – adds blur/border once user scrolls past hero
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location]);

  // Real-time: show toast when a new booking comes in (demo)
  useEffect(() => {
    if (!socket) return;
    socket.on("new_booking", (data) => {
      setNotification(`New booking by ${data.userName} for ${data.expertName}`);
      setTimeout(() => setNotification(null), 5000);
    });
    return () => socket.off("new_booking");
  }, [socket]);

  const navLinks = [
    { label: "Home",    path: "/" },
    { label: "Experts", path: "/experts" },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-dark/95 backdrop-blur-md border-b border-brand-border shadow-card"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center
                            group-hover:scale-105 transition-transform duration-200">
              <span className="text-brand-dark font-display font-bold text-sm">E</span>
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              Expert<span className="text-brand-gold">Book</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-brand-gold"
                    : "text-brand-slate hover:text-brand-text"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Socket indicator */}
            <div className="flex items-center gap-1.5 text-xs text-brand-slate">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
              {isConnected ? "Live" : "Offline"}
            </div>
            <Link to="/experts" className="btn-primary text-sm py-2 px-5">
              Book a Session
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-brand-slate hover:text-brand-text p-2"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-brand-card border-t border-brand-border px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-sm font-medium py-2 transition-colors ${
                  isActive(link.path) ? "text-brand-gold" : "text-brand-slate"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/experts" className="block btn-primary text-center text-sm mt-2">
              Book a Session
            </Link>
          </div>
        )}
      </nav>

      {/* Real-time toast notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 card px-5 py-4 max-w-sm border-brand-gold/50 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <span className="text-brand-gold text-lg">🔔</span>
            <p className="text-sm text-brand-text">{notification}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
