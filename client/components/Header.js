import tw, { styled } from "twin.macro"
import Logo from "./Logo"
import Nav from "./Nav"

export default function Header() {
	// get pathname from router

	return (
		<StyledHeader>
			<Logo size="lg" />
			{/* <Nav /> */}
		</StyledHeader>
	)
}
const StyledHeader = styled.header`
	${tw`flex justify-center items-center my-4`}
`
