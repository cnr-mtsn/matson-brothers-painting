'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import '../app/styles/carousel.css'

function ImageCarousel() {
    const [currentImage, setCurrentImage] = useState(1) 
    const maxImages = 66;

    const previousImage = () => {
        if (currentImage === 1) setCurrentImage(maxImages)
        else setCurrentImage(currentImage - 1)
    }
    const nextImage = () => {
        if (currentImage === maxImages) setCurrentImage(1)
        else setCurrentImage(currentImage + 1)
    }

    return (
        <div className="carousel">
            <button className="previous" onClick={previousImage}>
                <Image src="chevron-left.svg" width={25} height={25} alt="previous" />
            </button>
            <div className="images">
                <Image src={`/images/photo-${currentImage}.jpg`} width={600} height={400} alt={`photo-${currentImage}`} />
            </div>
            <button className="next" onClick={nextImage}>
                <Image src="chevron-right.svg" width={25} height={25} alt="forward" />
            </button>
        </div>
    )
}

export default ImageCarousel