import Image from "next/image"
import Link from "next/link"
import tw, { styled } from "twin.macro"

export default function Logo({ size = "md" }) {
	return (
		<StyledLogo href="/" size={size}>
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
	`}
	${({ size }) => {
		switch (size) {
			case "sm":
				return tw`h-12 w-48 md:w-64`
			case "md":
				return tw`h-16 w-64 md:w-80`
			case "lg":
				return tw`h-20 w-80 md:w-96`
			default:
				return tw`h-16 w-64 md:w-80`
		}
	}}
`
