
import { ErrorBoundary } from "react-error-boundary";
import { getPokemon, getImageUrlForPokemon, getImageSrc } from "./utils.tsx";
import { Suspense, use } from "react";

function PokemonDetails({
    pokemonName,
}: {
    pokemonName: string;
}) {
    const pokemon = use(getPokemon(pokemonName));
    const pokemonImgUrl = pokemonName == "eevee" ? "eevee1" : getImageUrlForPokemon(pokemonName);
    return (
        <div className="text-center space-y-4 min-h-100">
            <div className="flex justify-center">
                <ErrorBoundary FallbackComponent={ImgErrorFallback}>
                    <Suspense fallback={<ImgSuspenseFallback />} key={pokemonImgUrl}>
                        <Img src={pokemonImgUrl} alt={pokemon.name} />
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

function Img({ src, alt }: { src: string; alt: string; }) {
    const imgSrc = use(getImageSrc(src));
    return <img src={imgSrc} alt={alt} className="w-64 h-64" />;
}

function ImgErrorFallback() {
    return <img src="/img/error-pokemon.png" alt="error" className="w-64 h-64" />;
}

function ImgSuspenseFallback() {
    return <img src="/img/fallback-pokemon.png" alt="error" className="w-64 h-64" />;
}
export default PokemonDetails