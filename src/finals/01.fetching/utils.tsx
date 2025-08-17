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

export function getPokemon(name: string): Pokemon {
  const pokemon: Pokemon = {
    name,
    id: Math.floor(Math.random() * 1000),
    image: getImageUrlForPokemon(name),
    abilities: [
      { slot: 1, ability: { name: "overgrow", url: "" } },
      { slot: 2, ability: { name: "chlorophyll", url: "" } },
    ],
  };

  return pokemon;
}

const nowAPI = Date.now();
export function getImageUrlForPokemon(pokemonName: string, now?: number): string {
  // Replace this with a third-party sprite service or fallback to the default one
  const time = now ?? nowAPI
  const sanitized = pokemonName.toLowerCase().replace(/\s+/g, "-");
  return `https://img.pokemondb.net/artwork/large/${sanitized}.jpg?ts=${time}`;
}

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

export const pokemonNameDefault = "squirtle";
