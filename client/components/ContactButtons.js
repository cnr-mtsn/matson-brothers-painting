import Link from "next/link"
import tw, { styled } from "twin.macro"
import EmailIcon from "./icons/EmailIcon"
import PhoneIcon from "./icons/PhoneIcon"

export default function ContactButtons() {
	const email = process.env.NEXT_PUBLIC_EMAIL_ADDRESS
	const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER
	return (
		<StyledContactButtons>
			<a title={`Call us at ${phone}`} href={`tel:${phone}`}>
				<PhoneIcon className="h-4 w-4" />
			</a>
			<a title={`E-mail us at ${email}`} href={`mailto:${email}`}>
				<EmailIcon className="h-4 w-4" />
			</a>
		</StyledContactButtons>
	)
}
const StyledContactButtons = styled.div`
	${tw`flex gap-2`}
	svg {
		${tw`h-5 w-5`}
	}
`
