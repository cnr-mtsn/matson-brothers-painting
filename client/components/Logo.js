import Image from "next/image"
import Link from "next/link"
import tw, { styled } from "twin.macro"

export default function Logo() {
	return (
		<StyledLogo href="/">
			<Image
				className="logo"
				src="/images/mbp.jpg"
				alt="logo"
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
		h-16 w-64 md:w-80
	`}
`
