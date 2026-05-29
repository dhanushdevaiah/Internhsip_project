import React, { useState } from "react";
import ExpertCard from "../components/ExpertCard";
import useExperts from "../hooks/useExperts";
import { useSearchParams } from "react-router-dom";

const CATEGORIES = ["All","Technology","Finance","Legal","Health","Marketing","Design","Business","Education"];
const SORT_OPTIONS = [
  { value: "rating-desc", label: "Top Rated"    },
  { value: "rate-asc",    label: "Price: Low→High" },
  { value: "rate-desc",   label: "Price: High→Low" },
  { value: "newest",      label: "Newest"       },
];

const SkeletonCard = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-start gap-4">
      <div className="skeleton w-14 h-14 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4" /><div className="skeleton h-3 w-1/2" />
      </div>
    </div>
    <div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-5/6" />
    <div className="skeleton h-8 rounded-lg mt-4" />
  </div>
);

const ExpertsPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sort,    setSort]    = useState("rating-desc");
  const [search,  setSearch]  = useState("");
  const [page,    setPage]    = useState(1);

  const filters = {
    ...(activeCategory !== "All" && { category: activeCategory }),
    ...(search && { search }),
    sort,
    page,
    limit: 9,
  };

  const { experts, loading, error, meta } = useExperts(filters);

  const handleCategory = (cat) => { setActiveCategory(cat); setPage(1); };

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pb-24">

        {/* Page Header */}
        <div className="mb-12">
          <p className="text-brand-gold font-mono text-xs uppercase tracking-widest mb-2">Browse</p>
          <h1 className="section-title mb-2">Our Experts</h1>
          <span className="gold-line" />
          <p className="text-brand-slate">
            {meta.total} verified professionals ready to help
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, skill, or keyword…"
              className="input-field pl-11"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field sm:w-52"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`text-sm px-4 py-2 rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-brand-gold text-brand-dark border-brand-gold font-semibold"
                  : "border-brand-border text-brand-slate hover:border-brand-gold/40 hover:text-brand-text"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="card border-red-500/30 p-6 text-center text-red-400 mb-8">
            {error}. <button onClick={() => window.location.reload()} className="underline">Retry</button>
          </div>
        )}

        {/* Grid */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)
              : experts.length === 0
                ? (
                  <div className="col-span-3 text-center py-20">
                    <p className="text-5xl mb-4">🔍</p>
                    <h3 className="font-display text-xl mb-2">No experts found</h3>
                    <p className="text-brand-slate text-sm">Try adjusting your filters or search term.</p>
                  </div>
                )
                : experts.map((expert, i) => (
                  <ExpertCard key={expert._id} expert={expert} index={i} />
                ))
            }
          </div>
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn-outline text-sm py-2 px-4 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-mono transition-all ${
                  p === page
                    ? "bg-brand-gold text-brand-dark font-bold"
                    : "border border-brand-border text-brand-slate hover:border-brand-gold/40"
                }`}>
                {p}
              </button>
            ))}
            <button
              disabled={page === meta.pages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-outline text-sm py-2 px-4 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertsPage;
