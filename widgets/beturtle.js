'use client'

import Image from 'next/image'
import turtle from '../public/turtle.svg'
import { Title } from '../shared/ui'
import { Button } from '../shared/ui'
import { useEffect, useState } from 'react'

const positive = { title: 'Выбрать' }
const negative = { title: 'Выбрано' }

// Массив имен черепашек для рандомного выбора
const turtleNames = ['leonardo', 'donatello', 'raphael', 'michelangelo']

// Базовый URL для изображений
const BASE_URL = 'https://www.turtletime.dev'

export const BeTurtle = () => {
	const [button, setButton] = useState(positive)
	const [trigger, setTrigger] = useState(0)
	const [typeCharacter, setTypeCharacter] = useState('Ваша черепаха')
	const [turtleData, setTurtleData] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (trigger > 0) {
			const fetchTurtle = async () => {
				try {
					setLoading(true)
					// Выбираем случайную черепашку
					const randomName =
						turtleNames[Math.floor(Math.random() * turtleNames.length)]
					const response = await fetch(
						`https://www.turtletime.dev/api/v1/turtles/${randomName}`
					)

					if (!response.ok) {
						throw new Error('Ошибка загрузки данных')
					}

					const data = await response.json()
					setTurtleData(data)
					// Используем full_name вместо name
					setTypeCharacter(data.full_name || data.name || randomName)
				} catch (error) {
					console.error('Error fetching turtle:', error)
					setTypeCharacter('Ошибка загрузки')
				} finally {
					setLoading(false)
				}
			}

			fetchTurtle()
		}
	}, [trigger])

	const handleButtonClick = () => {
		setTrigger(prev => prev + 1)
		setButton(button === positive ? negative : positive)
	}

	return (
		<div className='px-9'>
			<div className='px-11 py-10'>
				<Title children='Стань черепашкой!' />
			</div>
			<div className='flex justify-between bg-[#111111] rounded-[20px] px-11 items-center'>
				<div>
					<span className='text-[#51BA55] font-[Inter] text-[64px] font-bold'>
						Шаг 1
					</span>
					<p className='text-[#C0C0C0] font-[Inter] font-light text-[40px]'>
						Определи черепашку для боя
					</p>

					{/* Отображение данных черепашки */}
					<div className='py-4'>
						<h3 className='text-white font-[Inter] text-[32px] font-bold'>
							{loading ? 'Загрузка...' : typeCharacter}
						</h3>
						{turtleData && (
							<div className='text-[#C0C0C0] text-[24px] mt-2 '>
								<p>Цвет: {turtleData.color}</p>
								<p>Оружие: {turtleData.weapon}</p>
								<p>Любимая пицца: {turtleData.favorite_pizza}</p>
							</div>
						)}
					</div>

					<div className='py-4'>
						<Button children={button.title} func={handleButtonClick} />
					</div>
				</div>
				<div>
					{/* Показываем изображение черепашки если есть данные, иначе заглушку */}
					{turtleData && turtleData.image_url ? (
						<Image
							src={`${BASE_URL}${turtleData.image_url}`}
							alt={typeCharacter}
							className='rounded-4xl w-[370px] py-10'
							width={370}
							height={300}
						/>
					) : (
						<Image
							src={turtle}
							alt='черепашки'
							className='rounded-4xl w-[370px] py-10'
						/>
					)}
				</div>
			</div>
		</div>
	)
}
