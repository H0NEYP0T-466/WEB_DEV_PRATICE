import React, { useEffect, useState } from "react";

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const limit = 10; 
  const offset = (page - 1) * limit;

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        setPokemons(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Pokémon List</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {!loading &&
          !error &&
          pokemons.map((pokemon, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow p-4 flex flex-col items-center"
            >
              <p className="capitalize font-semibold">{pokemon.name}</p>
              <a
                href={pokemon.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm mt-2"
              >
                View Details
              </a>
            </div>
          ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-semibold">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
