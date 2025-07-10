import React, { Suspense, use } from "react";
import { getImageUrlForPokemon, getPokemon, type Pokemon } from "./utils.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { useSpinDelay } from "spin-delay";
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold text-red-600">Error</h2>
      <p className="text-sm text-gray-500">{error.message}</p>
      <p className="text-sm text-gray-500">
        Please try again later or contact support.
      </p>
    </div>
  );
}
const pokemonNameDefault = "ditto";
function App() {
  const [pokemonName, setPokemonName] = React.useState(pokemonNameDefault);
  const [optimisticPokemon, setOptimisticPokemon] =
    React.useOptimistic<Pokemon | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const delayedPending = useSpinDelay(isPending, {
    delay: 300,
    minDuration: 500,
  });

  function handlePokemonChange(name: string) {
    startTransition(() => setPokemonName(name));
  }

  console.log("pokemonName", pokemonName);
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
      <div className="flex flex-col items-center space-y-6">
        <PokemonSelector
          pokemonName={pokemonName}
          onChange={handlePokemonChange}
        />
        <div className="bg-white shadow-xl rounded-2xl max-w-md w-full">
          <div
            className={`px-6 py-12`}
            style={{ opacity: delayedPending ? 0.6 : 1 }}
          >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense
                fallback={<PokemonFallback pokemonName={pokemonName} />}
              >
                <PokemonDetails
                  pokemonName={pokemonName}
                  optimisticPokemon={optimisticPokemon}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
        <FastLoadPokemon
          setPokemonName={setPokemonName}
          setOptimisticPokemon={setOptimisticPokemon}
        />
      </div>
    </div>
  );
}

const pokemonFastloadList = [
  {
    name: "ditto",
    image: "/img/pokemon/ditto.jpg",
  },
  {
    name: "pikachu",
    image: "/img/pokemon/pikachu.jpg",
  },
  {
    name: "charmander",
    image: "/img/pokemon/charmander.jpg",
  },
  {
    name: "bulbasaur",
    image: "/img/pokemon/bulbasaur.jpg",
  },
];

type FastLoadPokemonType = {
  name: string;
  image: string;
};
function FastLoadPokemon({
  setPokemonName,
  setOptimisticPokemon,
}: {
  setPokemonName: (name: string) => void;
  setOptimisticPokemon: (pokemon: Pokemon | null) => void;
}) {
  const [selectedPokemon, setSelectedPokemon] =
    React.useState<FastLoadPokemonType | null>(null);
  const [message, setMessage] = React.useOptimistic<string | null>(
    "Load a Pokémon"
  );
  function handlePokemonClick(pokemon: FastLoadPokemonType) {
    const { name, image } = pokemon;
    setMessage(`loading ${name}...`);
    setOptimisticPokemon({
      name,
      id: 0, // Placeholder ID, as we don't have it for fast load
      image,
      abilities: [],
    });
    setPokemonName(name);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fast Load Pokémon</h2>
      <div className="grid grid-cols-2 gap-4">
        {pokemonFastloadList.map((pokemon) => (
          <div
            key={pokemon.name}
            className={`p-4 border border-gray-200 bg-white rounded-lg cursor-pointer ${
              selectedPokemon?.name === pokemon.name ? "border-red-500" : ""
            }`}
            onClick={() => setSelectedPokemon(pokemon)}
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-24 h-24 object-contain mx-auto mb-2"
            />
            <h3 className="text-lg font-semibold">{pokemon.name}</h3>
          </div>
        ))}
        <button
          onClick={() => handlePokemonClick(selectedPokemon!)}
          className="col-span-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={!selectedPokemon}
        >
          {message}
        </button>
      </div>
    </div>
  );
}

function PokemonSelector({
  pokemonName,
  onChange,
}: {
  pokemonName: string;
  onChange: (name: string) => void;
}) {
  const pokemonsList = ["ditto", "pikachu", "charmander", "bulbasaur"];
  return (
    <div className="mb-6">
      <label
        htmlFor="pokemon-select"
        className="block text-sm font-medium text-gray-700"
      >
        Select Pokémon:
      </label>
      {pokemonsList.map((name) => (
        <button
          key={name}
          onClick={() => onChange(name)}
          className={`mt-2 mx-2  items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            name === pokemonName ? "text-red-500" : ""
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

function PokemonDetails({
  pokemonName,
  optimisticPokemon,
}: {
  pokemonName: string;
  optimisticPokemon: Pokemon | null;
}) {
  const delay =
    pokemonName === "pikachu" ? 2000 : pokemonName === "bulbasaur" ? 4000 : 10;
  const pokemon = optimisticPokemon ?? use(getPokemon(pokemonName, delay));
  return (
    <div className="text-center space-y-4 min-h-100">
      <div className="flex justify-center">
        <img
          src={getImageUrlForPokemon(pokemon.name)}
          alt={pokemon.name}
          className="w-64 h-64 object-contain"
        />
      </div>
      <section>
        <h2 className="text-2xl font-bold capitalize">
          {pokemon.name}
          <sup className="ml-1 text-sm text-gray-500">#{pokemon.id}</sup>
        </h2>
      </section>
      <section>
        {pokemon.abilities.length ? (
          <ul className="space-y-1">
            <li className="font-medium text-gray-700">Abilities:</li>
            {pokemon.abilities.map((t) => (
              <li key={t.ability.name} className="text-sm">
                <span className="capitalize text-gray-900">
                  {t.ability.name}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}

function PokemonFallback({ pokemonName }: { pokemonName: string }) {
  return (
    <div className="text-center space-y-4 animate-pulse min-h-100">
      <div className="flex justify-center">
        <img
          src="/img/fallback-ship.png"
          alt={pokemonName}
          className="w-64 h-64 object-contain"
        />
      </div>
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">
          {pokemonName}
          <sup className="ml-1 text-sm text-gray-700">XX</sup>
        </h2>
      </section>
      <section>
        <ul className="space-y-1">
          {Array.from({ length: 2 }).map((_, i) => (
            <li key={i} className="text-sm text-gray-800">
              <span className="font-medium">Loading</span>: <span>...</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
