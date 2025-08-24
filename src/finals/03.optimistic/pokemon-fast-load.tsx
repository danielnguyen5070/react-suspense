
import { useOptimistic, useState } from "react";
import { type Pokemon } from "./utils.tsx";
import { useFormStatus } from "react-dom";

function FastLoadPokemon({ setOptimisticPokemon, setPokemonName }: { setOptimisticPokemon: (pokemon: Pokemon) => void; setPokemonName: (name: string) => void; }) {
    const [pokemonSelect, setPokemonSelect] = useState("");
    const [message, setMessage] = useOptimistic("Load")
    return (
        <div className="">
            <div className="grid grid-cols-2 min-w-xs">
                <form className="col-span-4 mb-4"
                    action={async (formData: FormData) => {
                        setMessage("Loading")
                        const name = formData.get("name")?.toString()
                        const image = `/img/pokemon/${name}.jpg`;

                        setOptimisticPokemon({ id: 0, name: name || "", abilities: [], image })

                        await new Promise((resolve) => setTimeout(resolve, 2000));

                        setMessage("Loaded")
                        await new Promise((resolve) => setTimeout(resolve, 1000));

                        setPokemonName(name || "")
                    }}>
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

                    <ButtonLoad message={message} />
                </form>
            </div>
        </div>
    );
}

function ButtonLoad({ message }: { message: string }) {
    const formStatus = useFormStatus()
    const { pending } = formStatus

    return (
        <button
            type="submit"
            disabled={pending}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            {message}
        </button>
    )
}
export default FastLoadPokemon;