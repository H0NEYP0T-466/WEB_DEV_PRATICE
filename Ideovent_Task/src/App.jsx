import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLanding(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Landing Page */}
      <AnimatePresence>
        {showLanding && (
          <motion.div
            key="landing"
            className="fixed inset-0 flex items-center justify-center bg-indigo-600 text-white z-50"
          >
            <motion.h1
              layoutId="logo"
              className="text-6xl font-extrabold tracking-wide"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              MovieApp
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header className="p-4 bg-white/80 backdrop-blur-md shadow fixed top-0 left-0 right-0 z-40 flex items-center">
        <motion.h1
          layoutId="logo"
          className="text-xl font-bold text-indigo-600"
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          MovieApp
        </motion.h1>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="text-3xl font-semibold mb-6 text-slate-700"
        >
          Top Movies
        </motion.h2>

        {/* Example Movie Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.5 },
            },
          }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition cursor-pointer"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="aspect-[2/3] bg-slate-200 flex items-center justify-center text-slate-500">
                Poster
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-indigo-600">
                  Movie Title {i + 1}
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  This is a short description of the movie.
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default App;
