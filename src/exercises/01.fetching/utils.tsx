export type Pokemon = {
	name: string
	id: number
	abilities: Array<{
		slot: number
		ability: {
			name: string
			url: string
		}
	}>
}

export async function getPokemon(name: string, delay?: number): Promise<Pokemon> {
	if (delay) await new Promise((res) => setTimeout(res, delay))

	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
	if (!response.ok) {
		const message = await response.text()
		return Promise.reject(new Error(`Failed to fetch Pokémon: ${message}`))
	}
	
	const pokemon = await response.json()
	return pokemon as Pokemon
}

export function getImageUrlForPokemon(
	pokemonName: string
): string {
	// Replace this with a third-party sprite service or fallback to the default one
	const sanitized = pokemonName.toLowerCase().replace(/\s+/g, '-')
	return `https://img.pokemondb.net/artwork/large/${sanitized}.jpg`
}
