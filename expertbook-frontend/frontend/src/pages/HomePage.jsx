import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExpertCard from "../components/ExpertCard";
import useExperts from "../hooks/useExperts";

/* ─── Static data ──────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: "Technology",  icon: "⚡", desc: "Engineering, AI, Cloud",      color: "blue"   },
  { name: "Finance",     icon: "📈", desc: "Investing, Fundraising, CFO",  color: "green"  },
  { name: "Legal",       icon: "⚖️", desc: "Contracts, IP, Compliance",    color: "purple" },
  { name: "Health",      icon: "🧠", desc: "Mental Health, Wellness",      color: "red"    },
  { name: "Marketing",   icon: "🚀", desc: "Growth, SEO, Performance",     color: "orange" },
  { name: "Design",      icon: "🎨", desc: "UX, Product, Visual Design",   color: "pink"   },
  { name: "Business",    icon: "💼", desc: "Strategy, Operations, GTM",    color: "yellow" },
  { name: "Education",   icon: "🎓", desc: "Tutoring, Career Coaching",    color: "teal"   },
];

const STATS = [
  { value: "500+", label: "Verified Experts" },
  { value: "12K+", label: "Sessions Completed" },
  { value: "4.8★", label: "Average Rating" },
  { value: "48hr", label: "Avg. Response Time" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Find Your Expert",   desc: "Browse by category, rating, or price. Filter to match your exact need." },
  { step: "02", title: "Book a Slot",        desc: "Pick a time that works. Sessions start at ₹75/hr with no hidden fees." },
  { step: "03", title: "Connect & Learn",    desc: "Join via video call, get personalised advice, and take action." },
];

/* ─── Skeleton Card ─────────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-start gap-4">
      <div className="skeleton w-14 h-14 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
    </div>
    <div className="skeleton h-3 w-full" />
    <div className="skeleton h-3 w-5/6" />
    <div className="flex gap-1.5">
      {[1,2,3].map(i => <div key={i} className="skeleton h-5 w-16 rounded-md" />)}
    </div>
    <div className="skeleton h-8 w-full rounded-lg mt-2" />
  </div>
);

/* ─── Component ─────────────────────────────────────────────────────────────── */
const HomePage = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const { experts, loading } = useExperts({ limit: 3, sort: "rating-desc" });

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-16">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#D4AF37 1px,transparent 1px),linear-gradient(90deg,#D4AF37 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Glow orb */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-3xl">
            <div className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <span className="inline-flex items-center gap-2 badge border-brand-gold/40 text-brand-gold text-xs mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                Verified Industry Experts
              </span>

              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
                Get advice from<br />
                <span className="text-brand-gold relative">
                  the best minds
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 300 6">
                    <path d="M0 3 Q75 0 150 3 Q225 6 300 3" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                </span><br />
                in the industry.
              </h1>

              <p className="section-subtitle mb-10 max-w-xl">
                Book one-on-one sessions with vetted experts in technology, finance, legal, design, and more. Real guidance, real results.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/experts" className="btn-primary text-base px-8 py-4">
                  Browse Experts →
                </Link>
                <a href="#how-it-works" className="btn-outline text-base px-8 py-4">
                  How It Works
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <section className="border-y border-brand-border bg-brand-card">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-bold text-brand-gold">{s.value}</div>
                <div className="text-brand-slate text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="text-brand-gold font-mono text-xs uppercase tracking-widest mb-2">Categories</p>
          <h2 className="section-title">Find expertise in<br />every field</h2>
          <span className="gold-line" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} to={`/experts?category=${cat.name}`}
              className="card p-5 group hover:shadow-glow-gold cursor-pointer">
              <span className="text-3xl block mb-3">{cat.icon}</span>
              <h3 className="font-display font-semibold text-brand-text group-hover:text-brand-gold
                             transition-colors duration-200 mb-1">
                {cat.name}
              </h3>
              <p className="text-brand-slate text-xs">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TOP EXPERTS ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-card border-y border-brand-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-brand-gold font-mono text-xs uppercase tracking-widest mb-2">Top Rated</p>
              <h2 className="section-title">Meet our featured experts</h2>
              <span className="gold-line" />
            </div>
            <Link to="/experts" className="btn-outline text-sm hidden md:flex">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [1,2,3].map((i) => <SkeletonCard key={i} />)
              : experts.map((expert, i) => <ExpertCard key={expert._id} expert={expert} index={i} />)
            }
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link to="/experts" className="btn-outline text-sm">View All Experts →</Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-brand-gold font-mono text-xs uppercase tracking-widest mb-2">Process</p>
          <h2 className="section-title">How ExpertBook works</h2>
          <span className="gold-line mx-auto" />
          <p className="section-subtitle max-w-xl mx-auto">Three steps between you and the advice that moves your career forward.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className={`card p-8 text-center animate-fade-in-up delay-${(i+1)*100}`}>
              <div className="font-mono text-5xl font-bold text-brand-gold/20 mb-4">{step.step}</div>
              <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-brand-slate text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="card p-12 text-center relative overflow-hidden shadow-glow-gold border-brand-gold/20">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #D4AF37, transparent 70%)" }} />
          <h2 className="section-title mb-4 relative z-10">
            Ready to accelerate<br />your growth?
          </h2>
          <p className="section-subtitle mb-8 relative z-10">
            Your first session is just a few clicks away.
          </p>
          <Link to="/experts" className="btn-primary text-base px-10 py-4 relative z-10 inline-block">
            Find Your Expert →
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
