import getStripe from "@lib/stripe"
import tw, { styled } from "twin.macro"

export default function index() {
	const redirectToCheckout = async () => {
		const {
			data: { id },
		} = await fetch("/api/checkout_sessions", {
			method: "POST",
			body: {
				items: [],
			},
		}).then(res => res.json())

		const stripe = await getStripe()
		await stripe.redirectToCheckout({ sessionId: id })
	}
	return <Styledindex>Pay Bill</Styledindex>
}
const Styledindex = styled.div`
	${tw`
        
    `}
`
