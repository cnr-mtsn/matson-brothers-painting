import tw, { styled } from "twin.macro"

export default function Page({
	children,
	description = "Trust Matson Brothers Painting, LLC - a reliable residential painting company in Oak Grove, MO with over 30 years of experience. Our team offers complete interior and exterior painting services to enhance the beauty of your home. Contact us today for a free estimate and let us bring new life to your space.",
	title = "Matson Brothers Painting, LLCf",
}) {
	return (
		<StyledPage>
			<meta name="description" content={description} />
			<title>{title}</title>
			{children}
		</StyledPage>
	)
}
const StyledPage = styled.div`
	${tw`p-10`}
`
