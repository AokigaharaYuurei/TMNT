'use client'

import Image from 'next/image'
import turtle from '../public/turtle.svg'
import { Title } from '../shared/ui'
import { Button } from '../shared/ui'
import { useEffect, useState } from 'react'

const positive = { title: 'Выбрать' }
const negative = { title: 'Выбрано' }

const BASE_URL = 'https://www.turtletime.dev'

export const BeTurtle2 = () => {
	const [button, setButton] = useState(positive)
	const [trigger, setTrigger] = useState(0)
	const [weaponsData, setWeaponsData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [selectedWeapon, setSelectedWeapon] = useState(null)

	useEffect(() => {
		if (trigger > 0) {
			const fetchAllWeapons = async () => {
				try {
					setLoading(true)
					// Загружаем все оружия из API
					const response = await fetch(`${BASE_URL}/api/v1/weapons`)

					if (!response.ok) {
						throw new Error('Ошибка загрузки данных об оружии')
					}

					const data = await response.json()
					setWeaponsData(data)

					// Выбираем случайное оружие из загруженных
					if (data && data.length > 0) {
						const randomWeapon = data[Math.floor(Math.random() * data.length)]
						setSelectedWeapon(randomWeapon)
					}
				} catch (error) {
					console.error('Error fetching weapons:', error)
				} finally {
					setLoading(false)
				}
			}
			fetchAllWeapons()
		}
	}, [trigger])

	const handleButtonClick = () => {
		setTrigger(prev => prev + 1)
		setButton(button === positive ? negative : positive)

		// Если данные уже загружены, выбираем случайное оружие
		if (weaponsData && weaponsData.length > 0) {
			const randomWeapon =
				weaponsData[Math.floor(Math.random() * weaponsData.length)]
			setSelectedWeapon(randomWeapon)
		}
	}

	return (
		<div className='py-4 px-9'>
			<div className='flex justify-between bg-[#111111] rounded-[20px] px-11 items-center'>
				<div className='flex-1'>
					<span className='text-[#51BA55] font-[Inter] text-[64px] font-bold'>
						Шаг 2
					</span>
					<p className='text-[#C0C0C0] font-[Inter] font-light text-[40px]'>
						Выбери оружие
					</p>

					{/* Отображение выбранного оружия */}
					<div className='py-4'>
						<h3 className='text-white font-[Inter] text-[32px] font-bold'>
							{loading
								? 'Загрузка...'
								: selectedWeapon
								? selectedWeapon.name
								: 'Ваше Оружие'}
						</h3>
						{selectedWeapon && (
							<div className='text-[#C0C0C0] mt-2 flex gap-8'>
								<div>
									<p className='text-[24px] font-semibold'>
										Тип: {selectedWeapon.type}
									</p>
									<p className='text-[24px] mt-2'>
										Владелец: {selectedWeapon.wielder}
									</p>
									<p className='text-[22px] mt-2 italic'>
										{selectedWeapon.description}
									</p>
								</div>
								<div>
									<p className='text-[24px] font-semibold'>
										Специальные приемы:
									</p>
									<ul className='list-disc list-inside mt-2'>
										{selectedWeapon.special_moves &&
											selectedWeapon.special_moves.map((move, index) => (
												<li key={index} className='text-[22px]'>
													{move}
												</li>
											))}
									</ul>
								</div>
							</div>
						)}
					</div>

					<div className='py-4'>
						<Button children={button.title} func={handleButtonClick} />
					</div>
				</div>
				<div>
					<Image
						src={turtle}
						alt='оружие черепашки'
						className='rounded-4xl w-[370px] py-10'
					/>
				</div>
			</div>
		</div>
	)
}
