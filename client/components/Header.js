import tw, { styled } from "twin.macro"
import Logo from "./Logo"
import Nav from "./Nav"

export default function Header() {
	// get pathname from router

	return (
		<StyledHeader>
			<Logo size="sm" />
			<Nav />
		</StyledHeader>
	)
}
const StyledHeader = styled.header`
	${tw`flex justify-between items-end`}
`
