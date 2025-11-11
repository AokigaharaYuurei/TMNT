'use client'

import Image from 'next/image'
import { Title } from '../shared/ui'
import turtle from '../public/turtle.svg'
import { useEffect, useState } from 'react'

const BASE_URL = 'https://www.turtletime.dev'

export const AllVillians = () => {
	const [villains, setVillains] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchVillains = async () => {
			try {
				const response = await fetch(`${BASE_URL}/api/v1/villains`)

				if (!response.ok) {
					throw new Error('Ошибка загрузки злодеев')
				}

				const data = await response.json()
				setVillains(data)
			} catch (error) {
				console.error('Error fetching villains:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchVillains()
	}, [])

	if (loading) {
		return (
			<div>
				<div className='px-11 py-25'>
					<Title children='Все злодеи' />
				</div>
				<div className='grid grid-cols-3 gap-3 gap-x-30 mt-7 px-15 my-10'>
					{[...Array(6)].map((_, index) => (
						<div key={index} className='animate-pulse'>
							<div className='bg-gray-300 rounded-lg w-full h-64'></div>
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div>
			<div className='px-11 py-25'>
				<Title children='Все злодеи' />
			</div>
			<div className='gap-3 gap-x-30 mt-7 px-15 my-10 flex flex-wrap '>
				{villains.map((villain, index) => (
					<div key={villain.id || index} className='relative group'>
						<Image
							src={
								villain.image_url ? `${BASE_URL}${villain.image_url}` : turtle
							}
							alt={villain.name || 'злодей'}
							width={300}
							height={256}
							className='rounded-lg w-full h-64 object-cover transition-transform group-hover:scale-105'
						/>
						<div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b-lg'>
							<p className='text-center font-semibold'>{villain.name}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
