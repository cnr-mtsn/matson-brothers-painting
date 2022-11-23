import Image from "next/image"
import Link from "next/link"
import tw, { styled } from "twin.macro"

export default function Logo({ size = "normal" }) {
	const height =
		size === "xs" ? 20 : size === "sm" ? 40 : size === "lg" ? 80 : 60
	const width =
		size === "xs" ? 100 : size === "sm" ? 200 : size === "lg" ? 400 : 300
	return (
		<StyledLogo href="/">
			<Image
				className="logo"
				src="/images/mbp.jpg"
				alt="logo"
				// {...{ height, width }}
				layout="fill"
			/>
		</StyledLogo>
	)
}
const StyledLogo = styled.a`
	${tw`
		cursor-pointer dark:invert
		hover:opacity-80
		p-2
		relative
		transition-all duration-300 ease-in-out
		h-16 w-64 md:h-20 md:w-80
	`}
`
