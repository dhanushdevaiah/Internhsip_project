import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import Navbar       from "./components/Navbar";
import Footer       from "./components/Footer";
import HomePage     from "./pages/HomePage";
import ExpertsPage  from "./pages/ExpertsPage";
import ExpertDetail from "./pages/ExpertDetailPage";
import BookingPage  from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";

/**
 * App.js – Root Component
 *
 * Responsibilities:
 * 1. Wrap the app in SocketProvider (real-time connection available everywhere)
 * 2. Set up client-side routing with react-router-dom v6
 * 3. Define the persistent layout (Navbar + Footer around all pages)
 *
 * Key concept: <Routes> renders the FIRST matching <Route>.
 * The "*" path is a catch-all (404 page).
 */
function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/"                          element={<HomePage />} />
              <Route path="/experts"                   element={<ExpertsPage />} />
              <Route path="/experts/:id"               element={<ExpertDetail />} />
              <Route path="/book/:expertId"            element={<BookingPage />} />
              <Route path="/booking-confirmation/:id"  element={<BookingConfirmation />} />

              {/* 404 fallback */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                  <span className="text-7xl font-display font-bold text-brand-gold opacity-30">404</span>
                  <h2 className="text-2xl font-display mt-4 mb-2">Page Not Found</h2>
                  <p className="text-brand-slate mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              } />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
