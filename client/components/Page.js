import tw, { styled } from "twin.macro"

export default function Page({ children, title }) {
	return <StyledPage>{children}</StyledPage>
}
const StyledPage = styled.div`
	${tw`p-10`}
`
