import React, { Suspense } from "react";
import { pokemonNameDefault } from "./utils.tsx";
import PokemonSearch from "./pokemon-search.tsx";
import PokemonDetails from "./pokemon-detail.tsx";
import FastLoadPokemon from "./pokemon-fast-load.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { useSpinDelay } from "spin-delay";

function App() {
  const [pokemonName, setPokemonName] = React.useState(pokemonNameDefault);
  const [isPending, startTransition] = React.useTransition();
  const showSpinner = useSpinDelay(isPending, {
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
            style={{ opacity: showSpinner ? 0.6 : 1 }}
            className={`px-6 py-12 bg-white`}
          >
            <ErrorBoundary FallbackComponent={PokemonErrorFallback}>
              <Suspense fallback={<PokemonFallback pokemonName={pokemonName} />}>
                <PokemonDetails
                  pokemonName={pokemonName}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
        <FastLoadPokemon />
      </div>
    </div>
  );
}

function PokemonFallback({ pokemonName }: { pokemonName: string }) {
  return (
    <div className="text-center space-y-4 animate-pulse min-h-100">
      <div className="flex justify-center">
        <img
          src="/img/fallback-pokemon.png"
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

function PokemonErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-center space-y-4 animate-pulse min-h-100">
      <div className="flex justify-center">
        <img
          src="/img/error-pokemon.png"
          alt="Error"
          className="w-64 h-64 object-contain"
        />
      </div>
      <section>
        <ul className="space-y-1">
          {error.message}
        </ul>
      </section>
    </div>
  );
}

export default App;
