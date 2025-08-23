export const pokemonNameDefault = "squirtle";
export type Pokemon = {
  name: string;
  id: number;
  image: string; // Optional image URL for the Pokémon
  abilities: Array<{
    slot: number;
    ability: {
      name: string;
      url: string;
    };
  }>;
};

export type PokemonSearch = Array<Pokemon>;

const pokemonCache = new Map<string, Promise<Pokemon>>();
export function getPokemon(name: string, delay?: number): Promise<Pokemon> {
  const pokemonPromise = pokemonCache.get(name) ?? getPokemonImpl(name, delay);
  pokemonCache.set(name, pokemonPromise);
  return pokemonPromise;
}

// https://pokeapi.co/api/v2/pokemon/
async function getPokemonImpl(name: string, delay?: number): Promise<Pokemon> {
  if (delay) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch data for Pokémon: ${name}`);
  }
  const pokemon: Pokemon = await res.json();
  return pokemon;
}

const nowAPI = Date.now();
export function getImageUrlForPokemon(pokemonName: string, now?: number): string {
  // Replace this with a third-party sprite service or fallback to the default one
  const time = now ?? nowAPI
  const sanitized = pokemonName.toLowerCase().replace(/\s+/g, "-");
  return `https://img.pokemondb.net/artwork/large/${sanitized}.jpg?ts=${time}`;
}

// https://pokeapi.co/api/v2/pokemon?limit=1000
export function filterPokemons(query: string): PokemonSearch {
  const pokemons: PokemonSearch = [
    { name: "bulbasaur", id: 1, image: getImageUrlForPokemon("bulbasaur"), abilities: [] },
    { name: "ivysaur", id: 2, image: getImageUrlForPokemon("ivysaur"), abilities: [] },
    { name: "venusaur", id: 3, image: getImageUrlForPokemon("venusaur"), abilities: [] },
    { name: "charmander", id: 4, image: getImageUrlForPokemon("charmander"), abilities: [] },
    { name: "charmeleon", id: 5, image: getImageUrlForPokemon("charmeleon"), abilities: [] },
    { name: "charizard", id: 6, image: getImageUrlForPokemon("charizard"), abilities: [] },
    // Add more Pokémon as needed
  ];

  return pokemons.filter(pokemon => pokemon.name.includes(query.toLowerCase()));
}

