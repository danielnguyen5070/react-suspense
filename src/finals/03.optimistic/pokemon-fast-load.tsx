
import { useOptimistic, useState } from "react";
import { pokemonNameDefault, type Pokemon } from "./utils.tsx";
import { useFormStatus } from "react-dom";

function FastLoadPokemon({ setOptimisticPokemon, setPokemonName }: { setOptimisticPokemon: (pokemon: Pokemon) => void, setPokemonName: (name: string) => void }) {
    const [pokemonSelect, setPokemonSelect] = useState(pokemonNameDefault);
    const [message, setMessage] = useOptimistic<string>("Load");
    async function handleLoadPokemon(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage("Loading Pokémon...");
        const pokemonName = pokemonSelect.toLowerCase();
        const pokemon: Pokemon = {
            name: pokemonName,
            id: Math.floor(Math.random() * 1000), // Simulating an ID for the example
            image: `/img/pokemon/${pokemonName}.jpg`,
            abilities: [],
        };
        setOptimisticPokemon(pokemon);
        setPokemonName(pokemonName);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating network delay
        setMessage("Pokémon loaded successfully!");

        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulating network delay
        setMessage("Load Other Pokémon");

        await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulating network delay
        setMessage("Load");
    }

    return (
        <div className="">
            <div className="grid grid-cols-2 min-w-xs">
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

                    <CreateButton message={message} />
                </form>
            </div>
        </div>
    );
}


function CreateButton({ message }: { message: string }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{ opacity: pending ? 0.6 : 1 }}
        >
            {message}
        </button>
    )
}
export default FastLoadPokemon;