import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "GhibliVerse"; // consistent brand
const MOVIES_PER_PAGE = 8;

function truncate(text, n = 120) {
  if (!text) return "";
  return text.length > n ? text.slice(0, n).trim() + "…" : text;
}

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [error, setError] = useState(null);

  // UI state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // fetch data
  useEffect(() => {
    const fetchMovies = async () => {
      setStatus("loading");
      setError(null);
      try {
        const res = await fetch("https://ghibliapi.vercel.app/films");
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMovies(data || []);
        setStatus("success");
      } catch (e) {
        setError(e.message || "Unknown error");
        setStatus("error");
      }
    };
    fetchMovies();

    // landing timing
    const t = setTimeout(() => setShowLanding(false), 2500);
    return () => clearTimeout(t);
  }, []);

  // filter
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = !term
      ? movies
      : movies.filter((m) => m.title.toLowerCase().includes(term));
    // reset page if current page overflow after filtering
    const totalPages = Math.max(1, Math.ceil(list.length / MOVIES_PER_PAGE));
    if (page > totalPages) setPage(1);
    return list;
  }, [movies, search]); // eslint-disable-line

  // paginate
  const totalPages = Math.max(1, Math.ceil(filtered.length / MOVIES_PER_PAGE));
  const start = (page - 1) * MOVIES_PER_PAGE;
  const current = filtered.slice(start, start + MOVIES_PER_PAGE);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* --- Landing overlay with smooth morph animation --- */}
      <AnimatePresence>
        {showLanding && (
          <motion.div
            key="landing"
            className="fixed inset-0 flex items-center justify-center bg-indigo-600 text-white z-50"
          >
            <motion.h1
              layoutId="brand"
              className="text-6xl md:text-7xl font-extrabold tracking-wide"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {BRAND}
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Navbar (logo shares layoutId for morph) --- */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <motion.h1
            layoutId="brand"
            className="text-xl md:text-2xl font-bold text-indigo-600"
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {BRAND}
          </motion.h1>

          <div className="hidden md:block text-sm text-slate-500">
            Discover the magic ✨
          </div>
        </div>
      </header>

      {/* --- Main content --- */}
      <main className="pt-24 pb-16 mx-auto max-w-6xl px-4">
        {/* Controls */}
        <motion.div
          className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-700">
            Studio Ghibli Movies
          </h2>

          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title…"
              className="w-64 max-w-full rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </motion.div>

        {/* Status states */}
        {status === "loading" && (
          <div className="py-20 text-center text-slate-600 animate-pulse">
            Loading movies…
          </div>
        )}
        {status === "error" && (
          <div className="py-10 text-center text-red-600">
            {error || "Something went wrong."}
          </div>
        )}

        {/* Grid */}
        {status === "success" && (
          <>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                No movies match your search.
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
                  },
                }}
              >
                {current.map((movie) => (
                  <motion.article
                    key={movie.id}
                    variants={{
                      hidden: { opacity: 0, y: 22 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="group bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                  >
                    {movie.image ? (
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="h-64 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-64 w-full bg-slate-200 flex items-center justify-center text-slate-500">
                        No Image
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-indigo-700 group-hover:text-indigo-800 transition">
                        {movie.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {truncate(movie.description, 140)}
                      </p>
                      <div className="mt-3 text-xs text-slate-500">
                        🎬 {movie.director} &nbsp;•&nbsp; 📅 {movie.release_date}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => goTo(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition"
                >
                  Prev
                </button>

                <div className="hidden sm:flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => goTo(p)}
                        className={`px-3 py-2 rounded-lg border ${
                          p === page
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        } transition`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => goTo(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition"
                >
                  Next
                </button>

                <div className="sm:hidden text-sm text-slate-600 ml-2">
                  Page {page} / {totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
