import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "GhibliVerse";
const MOVIES_PER_PAGE = 8;

// Helper function to truncate text
function truncate(text, n = 120) {
  if (!text) return "";
  return text.length > n ? text.slice(0, n).trim() + "…" : text;
}

export default function App() {
  // State for the initial loading animation
  const [isLoading, setIsLoading] = useState(true);

  // States for movie data and UI
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // --- Effects ---

  // Effect to handle the initial animation timing and data fetching
  useEffect(() => {
    // Set a timer to end the loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200); // Animation duration

    // Fetch movie data
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

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Memos for Derived State ---

  // Memoized filtering logic
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = !term
      ? movies
      : movies.filter((m) => m.title.toLowerCase().includes(term));
    if (page * MOVIES_PER_PAGE > list.length) setPage(1);
    return list;
  }, [movies, search, page]);

  // Memoized pagination logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / MOVIES_PER_PAGE));
  const currentMovies = useMemo(() => {
    const start = (page - 1) * MOVIES_PER_PAGE;
    return filtered.slice(start, start + MOVIES_PER_PAGE);
  }, [filtered, page]);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  // --- Render Logic ---

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <AnimatePresence>
        {isLoading && (
          // 1. The Landing Screen
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-600"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              layoutId="brand-logo" // This ID connects it to the header logo
              className="text-6xl font-extrabold tracking-wide text-white"
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {BRAND}
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. The Main Application UI */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <motion.h1
            layoutId="brand-logo" // The same ID, enabling the morph animation
            className="text-2xl font-bold text-indigo-600"
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {BRAND}
          </motion.h1>
          <div className="hidden md:block text-sm text-slate-500">
            Discover the magic ✨
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 mx-auto max-w-6xl px-4">
        {/* Animate the content to fade in after the header is settled */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isLoading ? 2.5 : 0.2, duration: 0.5 }}
        >
          {/* Controls: Search and Title */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <h2 className="text-3xl font-semibold text-slate-700">
              Studio Ghibli Movies
            </h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title…"
              className="w-64 max-w-full rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status and Movie Grid */}
          {status === "loading" && <div className="py-20 text-center">Loading movies…</div>}
          {status === "error" && <div className="py-10 text-center text-red-600">{error}</div>}
          {status === "success" && (
            <>
              {currentMovies.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  No movies match your search.
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  variants={{
                    visible: { transition: { staggerChildren: 0.07 } },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {currentMovies.map((movie) => (
                    <motion.article
                      key={movie.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="group bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                    >
                      <img src={movie.image} alt={movie.title} className="h-64 w-full object-cover" loading="lazy" />
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold">{movie.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{truncate(movie.description)}</p>
                        <div className="mt-auto pt-3 text-xs text-slate-500">
                          🎬 {movie.director} &nbsp;•&nbsp; 📅 {movie.release_date}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                   <button onClick={() => goTo(page - 1)} disabled={page === 1} className="px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition">Prev</button>
                   <div className="text-sm text-slate-600">Page {page} / {totalPages}</div>
                   <button onClick={() => goTo(page + 1)} disabled={page === totalPages} className="px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition">Next</button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}