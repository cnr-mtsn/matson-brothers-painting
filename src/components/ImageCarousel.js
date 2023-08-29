import Image from "next/image"
import React, { useState } from "react"

const ImageCarousel = ({ images, height }) => {
	const [currentIndex, setCurrentIndex] = useState(0)

	const prevSlide = () => {
		const lastIndex = images.length - 1
		setCurrentIndex(currentIndex === 0 ? lastIndex : currentIndex - 1)
	}

	const nextSlide = () => {
		setCurrentIndex((currentIndex + 1) % images.length)
	}

	const nextImageIndex = (currentIndex + 1) % images.length
	const prevImageIndex =
		currentIndex === 0 ? images.length - 1 : currentIndex - 1

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
			{/* Hidden preloading for the next and previous images */}
			<div style={{ display: "none" }}>
				<Image
					layout="fill"
					objectFit="cover"
					alt="Preloading Next Image"
					src={`/images/photo-${nextImageIndex + 1}.jpg`}
				/>
				<Image
					layout="fill"
					objectFit="cover"
					alt="Preloading Previous Image"
					src={`/images/photo-${prevImageIndex + 1}.jpg`}
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
