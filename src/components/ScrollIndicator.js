import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const ScrollIndicator = ({ direction }) => {
	const [isVisible, setIsVisible] = useState(true)
	const indicatorRef = useRef(null)

	useEffect(() => {
		const onScroll = () => {
			if (!indicatorRef.current) return
			const rect = indicatorRef.current.getBoundingClientRect()
			if (rect.bottom < 0) {
				setIsVisible(false)
			}
		}

		window.addEventListener("scroll", onScroll)

		return () => {
			window.removeEventListener("scroll", onScroll)
		}
	}, [])
	if (!isVisible) return
	return (
		<div className="w-12 h-12 flex justify-center items-center animate-bounce mt-auto mx-auto">
			<Image
				height={20}
				width={20}
				src={`/svg/chevron-${direction}.svg`}
				alt="Scroll Indicator"
			/>
		</div>
	)
}

export default ScrollIndicator
