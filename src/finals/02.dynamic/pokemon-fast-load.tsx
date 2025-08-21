
import { useState } from "react";
import { pokemonNameDefault } from "./utils.tsx";

function FastLoadPokemon() {
    const [pokemonSelect, setPokemonSelect] = useState(pokemonNameDefault);
    return (
        <div className="">
            <div className="grid grid-cols-2 min-w-xs">
                <form className="col-span-4 mb-4">
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