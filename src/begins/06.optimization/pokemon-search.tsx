import React, { use } from "react";
import { filterPokemons } from "./utils.tsx";
import { useSpinDelay } from "spin-delay";

function PokemonSearch({
    onSelection,
}: {
    onSelection: (selection: string) => void;
}) {
    const [searchText, setSearchText] = React.useState<string>("");
    const defferredSearchText = React.useDeferredValue(searchText);
    const isDelay = useSpinDelay(searchText !== defferredSearchText)
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
            <ul
                style={{ opacity: isDelay ? 0.5 : 1 }}
                className="mt-2 space-y-1 max-h-120 overflow-auto"
            >
                <SearchResults searchText={defferredSearchText} onSelection={onSelection} />
            </ul>
        </div>
    );
}


function SearchResults({
    searchText,
    onSelection,
}: {
    searchText: string;
    onSelection: (selection: string) => void;
}) {
    const searchResults = use(filterPokemons(searchText));
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


export default PokemonSearch 