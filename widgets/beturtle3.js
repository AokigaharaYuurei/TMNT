'use client'

import Image from 'next/image'
import turtle from '../public/turtle.svg'
import { Title } from '../shared/ui'
import { Button } from '../shared/ui'
import { useEffect, useState } from 'react'

const positive = { title: 'Выбрать' }
const negative = { title: 'Выбрано' }

const BASE_URL = 'https://www.turtletime.dev'

export const BeTurtle3 = () => {
	const [button, setButton] = useState(positive)
	const [trigger, setTrigger] = useState(0)
	const [enemiesData, setEnemiesData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [selectedEnemy, setSelectedEnemy] = useState(null)

	useEffect(() => {
		if (trigger > 0) {
			const fetchAllEnemies = async () => {
				try {
					setLoading(true)
					const response = await fetch(`${BASE_URL}/api/v1/villains`)

					if (!response.ok) {
						throw new Error('Ошибка загрузки данных о сопернике')
					}

					const data = await response.json()
					setEnemiesData(data)

					if (data && data.length > 0) {
						const randomEnemy = data[Math.floor(Math.random() * data.length)]
						setSelectedEnemy(randomEnemy)
					}
				} catch (error) {
					console.error('Error fetching enemies:', error)
				} finally {
					setLoading(false)
				}
			}
			fetchAllEnemies()
		}
	}, [trigger])

	const handleButtonClick = () => {
		setTrigger(prev => prev + 1)
		setButton(button === positive ? negative : positive)

		// Исправлено: enemiesData вместо weaponsData
		if (enemiesData && enemiesData.length > 0) {
			const randomEnemy =
				enemiesData[Math.floor(Math.random() * enemiesData.length)]
			setSelectedEnemy(randomEnemy)
		}
	}

	return (
		<div className='py-4 px-9'>
			<div className='flex justify-between bg-[#111111] rounded-[20px] px-11 items-center'>
				<div className='flex-1'>
					<span className='text-[#51BA55] font-[Inter] text-[64px] font-bold'>
						Шаг 3
					</span>
					<p className='text-[#C0C0C0] font-[Inter] font-light text-[40px]'>
						Узнай своего соперника
					</p>

					{/* Отображение информации о сопернике */}
					<div className='py-4'>
						<h3 className='text-white font-[Inter] text-[32px] font-bold'>
							{loading
								? 'Загрузка...'
								: selectedEnemy
								? selectedEnemy.name
								: 'Ваш соперник'}
						</h3>
						{selectedEnemy && (
							<div className='text-[#C0C0C0] text-[24px] mt-2'>
								<p>Настоящее имя: {selectedEnemy.real_name}</p>
								<p>Описание: {selectedEnemy.description}</p>
								<p>Уровень угрозы: {selectedEnemy.threat_level}</p>
								{selectedEnemy.abilities && (
									<div className='mt-4'>
										<p className='font-semibold'>Способности:</p>
										<ul className='list-disc list-inside'>
											{selectedEnemy.abilities.map((ability, index) => (
												<li key={index}>{ability}</li>
											))}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>

					<div className='py-4'>
						<Button children={button.title} func={handleButtonClick} />
					</div>
				</div>
				<div>
					{/* Показываем изображение соперника если есть данные, иначе заглушку */}
					{selectedEnemy && selectedEnemy.image_url ? (
						<Image
							src={`${BASE_URL}${selectedEnemy.image_url}`}
							alt={selectedEnemy.name}
							className='rounded-4xl w-[370px] py-10'
							width={370}
							height={300}
						/>
					) : (
						<Image
							src={turtle}
							alt='соперники'
							className='rounded-4xl w-[370px] py-10'
						/>
					)}
				</div>
			</div>
		</div>
	)
}
