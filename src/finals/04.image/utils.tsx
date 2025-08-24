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
const nowAPI = Date.now();

// https://pokeapi.co/api/v2/pokemon/
async function getPokemonImpl(name: string, delay?: number): Promise<Pokemon> {
  if (delay) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}?ts=${nowAPI}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch data for Pokémon: ${name}`);
  }
  const pokemon: Pokemon = await res.json();
  return pokemon;
}

export function getImageUrlForPokemon(pokemonName: string, now?: number): string {
  // Replace this with a third-party sprite service or fallback to the default one
  const time = now ?? nowAPI
  const sanitized = pokemonName.toLowerCase().replace(/\s+/g, "-");
  return `https://img.pokemondb.net/artwork/large/${sanitized}.jpg?ts=${time}`;
}

// https://pokeapi.co/api/v2/pokemon?limit=1000
export function filterPokemons(query: string): PokemonSearch {
  const pokemons: PokemonSearch = [
    { name: "bulbasaur", id: 1, image: "/img/pokemon/bulbasaur.jpg", abilities: [] },
    { name: "charmander", id: 2, image: "/img/pokemon/charmander.jpg", abilities: [] },
    { name: "ditto", id: 3, image: "/img/pokemon/ditto.jpg", abilities: [] },
    { name: "eevee", id: 4, image: "/img/pokemon/eevee.jpg", abilities: [] },
    { name: "gengar", id: 5, image: "/img/pokemon/gengar.jpg", abilities: [] },
    { name: "jigglypuff", id: 6, image: "/img/pokemon/jigglypuff.jpg", abilities: [] },
    { name: "lapras", id: 7, image: "/img/pokemon/lapras.jpg", abilities: [] },
    { name: "pikachu", id: 8, image: "/img/pokemon/pikachu.jpg", abilities: [] },
    // Add more Pokémon as needed
  ];

  return pokemons.filter(pokemon => pokemon.name.includes(query.toLowerCase()));
}

const imageCache = new Map<string, Promise<string>>();
export function getImageSrc(url: string): Promise<string> {
  const cached = imageCache.get(url) ?? preloadImage(url);
  imageCache.set(url, cached);
  return cached;
}

function preloadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = (err) => reject(err);
  });
}