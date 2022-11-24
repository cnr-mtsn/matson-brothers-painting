import tw, { styled } from "twin.macro"

export default function Overlay({ open }) {
	return <StyledOverlay open={open}></StyledOverlay>
}
const StyledOverlay = styled.div`
	${({ open }) =>
		open
			? tw`fixed inset-0 bg-black opacity-20 z-0 pointer-events-none`
			: tw`hidden`}
`
