import React, { useEffect, useState } from "react";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("https://ghibliapi.vercel.app/films");
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();

        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-10 drop-shadow">
        🎬 Studio Ghibli Movies
      </h1>

      {loading && (
        <p className="text-center text-lg font-medium animate-pulse">
          Loading movies...
        </p>
      )}
      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {!loading &&
          !error &&
          movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-2 overflow-hidden flex flex-col"
            >
              {movie.image ? (
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="bg-gray-300 h-64 flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-bold text-xl text-gray-800 mb-2">
                  {movie.title}
                </h2>
                <p className="text-sm text-gray-600 flex-grow line-clamp-4">
                  {movie.description}
                </p>
                <p className="mt-3 text-xs text-gray-500">
                  🎬 Directed by:{" "}
                  <span className="font-medium">{movie.director}</span> | 📅{" "}
                  {movie.release_date}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
