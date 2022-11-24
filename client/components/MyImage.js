import client from "@lib/sanity"
import { useNextSanityImage } from "next-sanity-image"
import Image from "next/image"
import tw, { styled } from "twin.macro"

export default function MyImage({ src }) {
	const imageProps = useNextSanityImage(client, src)

	return (
		<StyledMyImage className="image">
			<Image {...imageProps} layout="fill" objectFit="contain" />
		</StyledMyImage>
	)
}
const StyledMyImage = styled.div`
	${tw`relative w-80 h-80`}
`
