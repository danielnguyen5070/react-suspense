import React, { Suspense, use } from 'react'
import {
	getImageUrlForPokemon,
	getPokemon,
} from './utils.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import { useSpinDelay } from 'spin-delay'
function ErrorFallback({ error }: { error: Error }) {
	return (
		<div className="text-center space-y-4">
			<h2 className="text-2xl font-semibold text-red-600">Error</h2>
			<p className="text-sm text-gray-500">{error.message}</p>
			<p className="text-sm text-gray-500">
				Please try again later or contact support.
			</p>
		</div>
	)	
}
const pokemonNameDefault = 'ditto'
function App() {
	const [pokemonName, setPokemonName] = React.useState(pokemonNameDefault)
	const [isPending, startTransition] = React.useTransition()
	const delayedPending  = useSpinDelay(isPending, {
		delay: 300,
  		minDuration: 500,
	})

	function handlePokemonChange(name: string) {
		startTransition(() => setPokemonName(name))
	}

	return (
		<div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
			<div className='flex flex-col items-center space-y-6'>
				<PokemonSelector pokemonName={pokemonName} onChange={handlePokemonChange} />
				<div className="bg-white shadow-xl rounded-2xl max-w-md w-full">
					<div className={`px-6 py-12` }
					style={{ opacity: delayedPending ? 0.6 : 1}}>
						<ErrorBoundary FallbackComponent={ErrorFallback}>
							<Suspense fallback={<PokemonFallback pokemonName={pokemonName} />}>
								<PokemonDetails pokemonName={pokemonName} />
							</Suspense>
						</ErrorBoundary>
					</div>
				</div>
			</div>
		</div>
	)
}

function PokemonSelector({
	pokemonName,
	onChange,
}: {
	pokemonName: string
	onChange: (name: string) => void
}) {
	const pokemonsList = [
		'ditto',
		'pikachu',
		'charmander',
		'bulbasaur',
	]
	return (
		<div className="mb-6">
			<label htmlFor="pokemon-select" className="block text-sm font-medium text-gray-700">
				Select Pokémon:
			</label>
			{
				pokemonsList.map((name) => (
					<button
						key={name}
						onClick={() => onChange(name)}
						className={`mt-2 mx-2  items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
							name === pokemonName ? 'text-red-500' : ''
						}`}
					>
						{name}
					</button>
				))
			}
		</div>
	)
}	

function PokemonDetails({pokemonName}: {pokemonName: string}) {
	const delay =
		pokemonName === 'pikachu' ? 2000 : pokemonName === 'bulbasaur' ? 4000 : 10
	const pokemon = use(getPokemon(pokemonName, delay))
	return (
		<div className="text-center space-y-4">
			<div className="flex justify-center">
				<img
					src={getImageUrlForPokemon(pokemon.name)}
					alt={pokemon.name}
					className="w-64 h-64 object-contain"
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
								<span className="capitalize text-gray-900">{t.ability.name}</span>
							</li>
						))}
					</ul>
				) : (
					<p className="text-sm text-gray-500">
						This Pokémon has no type data.
					</p>
				)}
			</section>
		</div>
	)
}

function PokemonFallback({pokemonName}: {pokemonName: string}) {
	return (
		<div className="text-center space-y-4 animate-pulse">
			<div className="flex justify-center">
				<img
					src="/img/fallback-ship.png"
					alt={pokemonName}
					className="w-64 h-64 object-contain"
				/>
			</div>
			<section>
				<h2 className="text-2xl font-semibold text-gray-800">
					{pokemonName}
					<sup className="ml-1 text-sm text-gray-700">XX</sup>
				</h2>
			</section>
			<section>
				<ul className="space-y-1">
					{Array.from({ length: 2 }).map((_, i) => (
						<li key={i} className="text-sm text-gray-800">
							<span className="font-medium">Loading</span>: <span>...</span>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}

export default App
