import React, { Suspense, use, useTransition } from "react";
import {
  getImage,
  getPokemon,
  searchPokemons,
  type Pokemon,
  getImageUrlForPokemon,
} from "./utils.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { useSpinDelay } from "spin-delay";

const pokemonNameDefault = "ditto";
function App() {
  const [pokemonName, setPokemonName] = React.useState(pokemonNameDefault);
  const [optimisticPokemon, setOptimisticPokemon] =
    React.useOptimistic<Pokemon | null>(null);
  const [isPending, startTransition] = useTransition();
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
        <div className="flex flex-row shadow-xl rounded-2xl max-w-full w-full">
          <div className="px-6 py-4 bg-gray-50 rounded-l-2xl max-w-xs">
            <PokemonSearch
              onSelection={handlePokemonChange}
            />
          </div>
          <div
            className={`px-6 py-12 bg-white`}
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

function PokemonSearch({
  onSelection,
}: {
  onSelection: (selection: string) => void;
}) {
  const [searchText, setSearchText] = React.useState<string>("");
  const deferredSearchText = React.useDeferredValue(searchText);
  const isPending = useSpinDelay(searchText !== deferredSearchText)

  return (
    <div className="mb-6">
      <div>
        <input
          id="ship-name"
          type="text"
          placeholder="Search Pokémon"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mt-2 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ul
          className="mt-2 space-y-1 max-h-120 overflow-auto"
          style={{ opacity: isPending ? 0.6 : 1 }}
        >
          <Suspense fallback={<SearchResultsFallback />}>
            <SearchResults searchText={deferredSearchText} onSelection={onSelection} />
          </Suspense>
        </ul>
      </ErrorBoundary>
    </div>
  );
}

const shipFallbackSrc = "/img/fallback-ship.png";
function SearchResultsFallback() {
  return Array.from({ length: 12 }).map((_, i) => (
    <li key={i} className="cursor-pointer hover:bg-blue-100 py-2 rounded">
      <div>
        <div className="flex items-center space-x-2 px-2">
          <img
            src={shipFallbackSrc}
            className="w-12 h-12 p-2 object-contain bg-white rounded-full shadow-sm"
          />
          <span className="text-sm font-medium capitalize">{"Loading..."}</span>
        </div>
      </div>
    </li>
  ));
}

function SearchResults({
  searchText,
  onSelection,
}: {
  searchText: string;
  onSelection: (selection: string) => void;
}) {
  const searchResults = use(searchPokemons(searchText, 500));
  return (
    <>
      {searchResults.map((pokemon) => (
        <li
          key={pokemon.name}
          className="cursor-pointer hover:bg-blue-100 py-2 rounded"
          onClick={() => onSelection(pokemon.name)}
        >
          <div>
            <div className="flex items-center space-x-2 px-2">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-12 h-12 p-2 object-contain bg-white rounded-full shadow-sm"
              />
              <span className="text-sm font-medium capitalize">
                {pokemon.name}
              </span>
            </div>
          </div>
        </li>
      ))}
    </>
  );
}

async function createOptimisticPokemon(formData: FormData) {
  return {
    name: formData.get("name") as string, // This will be rendered by your <PokemonDetails />
    id: 0, // Placeholder ID
    image: await fileToDataUrl(formData.get("image") as File), // This will be rendered by your <Img />
    abilities: [],
  };
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function PokemonImg({
  src,
  ...props
}: { src: string } & React.ComponentProps<"img">) {
  return (
    <ErrorBoundary
      key={src}
      FallbackComponent={() => <img src="/img/error-pokemon.png" {...props} />}
    >
      <Suspense fallback={<img src="/img/fallback-ship.png" {...props} />}>
        <Img src={src} {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Img({ src, ...props }: { src: string } & React.ComponentProps<"img">) {
  const imageSuspense = use(getImage(src));
  return <img src={imageSuspense} {...props} />;
}
function PokemonDetails({
  pokemonName,
  optimisticPokemon,
}: {
  pokemonName: string;
  optimisticPokemon: Pokemon | null;
}) {
  const pokemonImgUrl = getImageUrlForPokemon(pokemonName);

  void getImage(pokemonImgUrl)
  const delay =
    pokemonName === "pikachu" ? 2000 : pokemonName === "bulbasaur" ? 4000 : 10;
  const pokemon = optimisticPokemon ?? use(getPokemon(pokemonName, delay));

  return (
    <div className="text-center space-y-4 min-h-100">
      <div className="flex justify-center">
        <PokemonImg
          src={pokemonImgUrl}
          alt={pokemon.name}
          className="w-64 h-64"
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

function FastLoadPokemon({
  setPokemonName,
  setOptimisticPokemon,
}: {
  setPokemonName: (name: string) => void;
  setOptimisticPokemon: (pokemon: Pokemon | null) => void;
}) {
  const [pokemonSelect, setPokemonSelect] = React.useState(pokemonNameDefault);
  async function handlePokemonClick(formData: FormData) {
    setOptimisticPokemon(await createOptimisticPokemon(formData));

    await sleep(3000); // Simulate a delay for optimistic UI
    const name = formData.get("name") as string;
    setPokemonName(name);
  }

  return (
    <div className="">
      <div className="grid grid-cols-2">
        <form className="col-span-4 mb-4" action={handlePokemonClick}>
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
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="mt-2 block w-full focus:outline-none focus:ring-2 focus:ring-blue-500 file:focus:ring-blue-500 file:text-sm file:font-medium file:bg-blue-600 file:text-white file:hover:bg-blue-700 file:cursor-pointer file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
              required
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
export default App;
