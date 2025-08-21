
import { getPokemon, type Pokemon } from "./utils.tsx";
import { use } from "react";

function PokemonDetails({
    pokemonName,
    optimisticPokemon
}: {
    pokemonName: string;
    optimisticPokemon: Pokemon | null;
}) {
    const pokemon = optimisticPokemon ?? use(getPokemon(pokemonName, 2000));
    console.log("PokemonDetails", pokemonName, optimisticPokemon);
    return (
        <div className="text-center space-y-4 min-h-100">
            <div className="flex justify-center">
                <img
                    src={pokemon.image}
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

export default PokemonDetails