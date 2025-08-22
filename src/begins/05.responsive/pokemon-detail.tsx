import { ErrorBoundary } from "react-error-boundary";
import { getPokemon, getImageUrlForPokemon, getImage } from "./utils.tsx";
import { use, Suspense } from "react";

function PokemonDetails({
    pokemonName,
    setPokemonName,
}: {
    pokemonName: string;
    setPokemonName: (name: string) => void;
}) {
    const pokemon = use(getPokemon(pokemonName));
    return (
        <div className="text-center space-y-4 min-h-100">
            <div className="flex justify-center">
                <ErrorBoundary FallbackComponent={ErrorFallback}
                    onReset={() => {
                        setPokemonName("bulbasaur"); // Reset the pokemon name
                        // Reset the state of the app so the user can try again
                    }}>
                    <Suspense fallback={<ImgFallback alt={pokemon.name} />} key={pokemon.name}>
                        <Img
                            src={getImageUrlForPokemon(pokemon.name == 'ditto' ? 'xxx' : pokemon.name)}
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

function Img({ src = '', ...props }: React.ComponentProps<'img'>) {
    const loadedSrc = use(getImage(src)); // resolves after preloading
    return <img src={loadedSrc} className="w-64 h-64 object-contain" {...props} />;
}

function ImgFallback({ ...props }: React.ComponentProps<'img'>) {
    return <img src="/img/fallback-pokemon.png" className="w-64 h-64 object-contain" {...props} />;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
    return (
        <div className="text-red-500">
            <p>Error loading Pokémon details:</p>
            <pre>{error.message}</pre>
            <button
                onClick={resetErrorBoundary}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Try Again
            </button>
        </div>
    );
}

export default PokemonDetails