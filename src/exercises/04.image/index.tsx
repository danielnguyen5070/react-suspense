import React, { Suspense, use } from "react";
import {
  getImageUrlForPokemon,
  getPokemon,
  getImage,
  type Pokemon,
} from "./utils.tsx";
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
        <LoadPokemon
          setPokemonName={setPokemonName}
          setOptimisticPokemon={setOptimisticPokemon}
        />
      </div>
    </div>
  );
}

function LoadPokemon({
  setPokemonName,
  setOptimisticPokemon,
}: {
  setPokemonName: (name: string) => void;
  setOptimisticPokemon: (pokemon: Pokemon | null) => void;
}) {
  function handlePokemonClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const imageUrl = "/img/pokemon/" + name + ".jpg";

    setOptimisticPokemon({
      name,
      id: 0, // Placeholder ID
      image: imageUrl, // This will be rendered by your <Img />
      abilities: [],
    });

    setPokemonName(name);
  }

  const [pokemonSelect, setPokemonSelect] = React.useState(pokemonNameDefault);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fast Load</h2>
      <div className="grid grid-cols-2">
        <form
          method="post"
          className="col-span-4 mb-4"
          onSubmit={handlePokemonClick}
        >
          <div>
            <label htmlFor="name">Name</label>
            <select
              id="name"
              name="name"
              value={pokemonSelect}
              onChange={(e) => setPokemonSelect(e.target.value)}
              className="bg-white mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="squirtle">Squirtle</option>
              <option value="snorlax">Snorlax</option>
              <option value="mewtwo">Mewtwo</option>
              <option value="eevee">Eevee</option>
              <option value="gengar">Gengar</option>
              <option value="jigglypuff">Jigglypuff</option>
              <option value="meowth">Meowth</option>
              <option value="psyduck">Psyduck</option>
              <option value="lapras">Lapras</option>
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>
            <img
              src={"/img/pokemon/" + pokemonSelect + ".jpg"}
              alt="Select Pokémon"
              className="p-4 mt-2 w-64 bg-white h-64 object-contain border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Load
          </button>
        </form>
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
  console.log("Rendering PokemonDetails for:", optimisticPokemon?.image);
  return (
    <div className="text-center space-y-4 min-h-100">
      <div className="flex justify-center">
        <ErrorBoundary
          FallbackComponent={() => (
            <img src="/img/fallback-ship.png" alt="Loading..." />
          )}
        >
          <Suspense
            fallback={<img src="/img/fallback-ship.png" alt={pokemon.name} />}
          >
            <Img
              src={pokemon.image ?? getImageUrlForPokemon(pokemon.name)}
              alt={pokemon.name}
            />
          </Suspense>
        </ErrorBoundary>
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

function Img({ src, alt }: { src: string; alt: string }) {
  const image = use(getImage(src));
  return <img src={image} alt={alt} className="w-64 h-64 object-contain" />;
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
