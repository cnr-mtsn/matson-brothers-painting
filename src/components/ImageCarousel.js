import Image from "next/image"
import React, { useState, useEffect } from "react"

const ImageCarousel = ({ images, height }) => {
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		// Preload the next image for smoother transitions
		const nextIndex = (currentIndex + 1) % images.length
		const image = new Image()
		image.src = `/images/photo-${nextIndex + 1}.jpg`
	}, [currentIndex, images])

	const prevSlide = () => {
		const lastIndex = images.length - 1
		setCurrentIndex(currentIndex === 0 ? lastIndex : currentIndex - 1)
	}

	const nextSlide = () => {
		setCurrentIndex((currentIndex + 1) % images.length)
	}

	return (
		<div className="relative overflow-hidden bg-gray-100 w-full h-auto">
			<div className={`relative h-80 lg:h-[600px]`}>
				<Image
					layout="fill"
					objectFit="cover"
					alt="Carousel Image"
					src={`/images/photo-${currentIndex + 1}.jpg`}
					className="transition-transform duration-500"
				/>
			</div>
			<button
				onClick={prevSlide}
				className="absolute top-1/2 left-2 bg-white dark:bg-black p-2 rounded-full hover:brightness-90 dark:hover:bg-stone-800 transition-all duration-300 ease-in-out"
			>
				<Image
					height={16}
					width={16}
					src="/svg/chevron-left.svg"
					alt="Previous Slide"
				/>
			</button>
			<button
				onClick={nextSlide}
				className="absolute top-1/2 right-2 bg-white dark:bg-black p-2 rounded-full hover:brightness-90 dark:hover:bg-stone-800 transition-all duration-300 ease-in-out"
			>
				<Image
					height={16}
					width={16}
					src="/svg/chevron-right.svg"
					alt="Next Slide"
				/>
			</button>
		</div>
	)
}

export default ImageCarousel
