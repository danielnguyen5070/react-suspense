
import { getPokemon, getImageUrlForPokemon, getImage } from "./utils.tsx";
import { use } from "react";

function PokemonDetails({
    pokemonName,
}: {
    pokemonName: string;
}) {
    const pokemon = use(getPokemon(pokemonName));
    return (
        <div className="text-center space-y-4 min-h-100">
            <div className="flex justify-center">
                <Img
                    src={getImageUrlForPokemon(pokemon.name)}
                    alt={pokemon.name}
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


function Img({ src = '', ...props }: React.ComponentProps<'img'>) {
    const loadedSrc = use(getImage(src)); // resolves after preloading
    return <img src={loadedSrc} className="w-64 h-64 object-contain" {...props} />;
}

export default PokemonDetails