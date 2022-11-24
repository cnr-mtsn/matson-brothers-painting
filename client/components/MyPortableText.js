import tw, { styled } from "twin.macro"
import { PortableText } from "@portabletext/react"

export default function MyPortableText({ content }) {
	const myComponents = {
		list: {
			bullet: ({ children }) => <ul tw="">{children}</ul>,
			number: ({ children }) => <ol tw="">{children}</ol>,
		},
		listItem: {
			bullet: ({ children }) => <li tw="list-disc ml-4">{children}</li>,
		},
	}
	return <StyledMyPortableText value={content} components={myComponents} />
}
const StyledMyPortableText = styled(PortableText)`
	${tw`bg-blue-200`}
`
