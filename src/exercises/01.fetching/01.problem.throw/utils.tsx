import { type Ship } from './api.server.ts'

export type { Ship }

export async function getShip(name: string, delay?: number) {
	const searchParams = new URLSearchParams({ name })
	if (delay) searchParams.set('delay', String(delay))
	const response = await fetch(`api/get-ship?${searchParams.toString()}`)
	if (!response.ok) {
		return Promise.reject(new Error(await response.text()))
	}
	try {
		const ship = await response.json()
		if (!ship) {
			throw new Error('No ship found')
		}
		return ship as Ship
	} catch (error) {
		return {
			name: 'Default Ship',
			image: '/img/ships/default-ship.webp',
			topSpeed: 0,
			weapons: [],
			fetchedAt: new Date().toISOString(),
		} as Ship
	}
}

export function getImageUrlForShip(
	shipName: string,
	{ size }: { size: number },
) {
	return `/img/ships/${shipName.toLowerCase().replaceAll(' ', '-')}.webp?size=${size}`
}
