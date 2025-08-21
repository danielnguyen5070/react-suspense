
import { useState } from "react";
import { pokemonNameDefault, type Pokemon } from "./utils.tsx";

function FastLoadPokemon({ setOptimisticPokemon, setPokemonName }: { setOptimisticPokemon: (pokemon: Pokemon) => void, setPokemonName: (name: string) => void }) {
    const [pokemonSelect, setPokemonSelect] = useState(pokemonNameDefault);

    function handleLoadPokemon(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const pokemonName = pokemonSelect.toLowerCase();
        const pokemon: Pokemon = {
            name: pokemonName,
            id: Math.floor(Math.random() * 1000), // Simulating an ID for the example
            image: `/img/pokemon/${pokemonName}.jpg`,
            abilities: [],
        };
        setOptimisticPokemon(pokemon);
        setPokemonName(pokemonName);
    }

    return (
        <div className="">
            <div className="grid grid-cols-2">
                <form className="col-span-4 mb-4"
                    onSubmit={handleLoadPokemon}>
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
export default FastLoadPokemon;