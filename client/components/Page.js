import tw, { styled } from "twin.macro"

export default function Page({ children }) {
	return <StyledPage>{children}</StyledPage>
}
const StyledPage = styled.div`
	${tw`text-blue-800`}
	h1 {
		${tw`text-3xl font-bold mx-auto w-max my-4`}
	}
`
