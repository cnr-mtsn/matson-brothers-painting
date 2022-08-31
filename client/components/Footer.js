import tw, { styled } from "twin.macro"

export default function Footer() {
	return <StyledFooter>Footer</StyledFooter>
}
const StyledFooter = styled.div`
	${tw`
        border-t border-gray-200
        flex items-center justify-center py-1 px-2
    `}
`
