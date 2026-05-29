import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { label: "Browse Experts",   path: "/experts" },
      { label: "How It Works",     path: "/#how-it-works" },
      { label: "Become an Expert", path: "/#become-expert" },
    ],
    Categories: [
      { label: "Technology", path: "/experts?category=Technology" },
      { label: "Finance",    path: "/experts?category=Finance" },
      { label: "Legal",      path: "/experts?category=Legal" },
      { label: "Health",     path: "/experts?category=Health" },
    ],
    Company: [
      { label: "About",   path: "/about" },
      { label: "Privacy", path: "/privacy" },
      { label: "Terms",   path: "/terms" },
    ],
  };

  return (
    <footer className="border-t border-brand-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center">
                <span className="text-brand-dark font-display font-bold text-sm">E</span>
              </div>
              <span className="font-display font-semibold text-lg">
                Expert<span className="text-brand-gold">Book</span>
              </span>
            </Link>
            <p className="text-brand-slate text-sm leading-relaxed max-w-xs">
              Connect with verified industry experts for one-on-one consultations.
              Grow faster with the right guidance.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {["Twitter", "LinkedIn", "GitHub"].map((s) => (
                <a key={s} href="#"
                  className="text-xs text-brand-slate hover:text-brand-gold border border-brand-border
                             hover:border-brand-gold/40 rounded-lg px-3 py-1.5 transition-all duration-200">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-mono uppercase tracking-widest text-brand-gold mb-4">{group}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.path}
                      className="text-sm text-brand-slate hover:text-brand-text transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-border mt-12 pt-6 flex flex-col md:flex-row
                        items-center justify-between gap-4">
          <p className="text-xs text-brand-slate">
            © {year} ExpertBook. All rights reserved.
          </p>
          <p className="text-xs text-brand-slate font-mono">
            Built with <span className="text-brand-gold">React</span> +{" "}
            <span className="text-brand-gold">Express</span> +{" "}
            <span className="text-brand-gold">MongoDB</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
