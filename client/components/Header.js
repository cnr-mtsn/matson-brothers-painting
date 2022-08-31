import Image from "next/image"
import Link from "next/link"
import tw, { styled } from "twin.macro"
import { useRouter } from "next/router"
import PhoneIcon from "./icons/PhoneIcon"
import EmailIcon from "./icons/EmailIcon"
import Head from "next/head"

export default function Header() {
	// get pathname from router
	const { pathname } = useRouter()

	const pages = [
		{ title: "Home", path: "/" },
		{ title: "About", path: "/about" },
		{ title: "Contact", path: "/contact" },
	]
	return (
		<StyledHeader>
			<div className="top">
				<Image
					src="/images/mbp.jpg"
					alt="logo"
					height="60"
					width="260"
				/>
				<div className="buttons">
					<a
						title="Call us at (816) 442-9156"
						href="tel:816-442-9156">
						<PhoneIcon className="h-4 w-4" />
					</a>
					<a
						title="E-mail us at matsonbrotherspainting@gmail.com"
						href="mailto:matsonbrotherspainting@gmail.com">
						<EmailIcon className="h-4 w-4" />
					</a>
				</div>
			</div>
			<nav>
				{pages.map(({ title, path }) => (
					<Link key={title} href={path}>
						<a className={pathname === path && "active"}>{title}</a>
					</Link>
				))}
			</nav>
		</StyledHeader>
	)
}
const StyledHeader = styled.header`
	div.top {
		${tw`
			flex justify-between items-end
			p-2
		`}
		div.buttons {
			${tw`flex gap-2`}
			a {
				${tw`
					flex 
					rounded-full 
					bg-blue-100 hover:bg-blue-200 
					p-2
					transition-all duration-300 ease-in-out
				`}
			}
			svg {
				${tw`h-5 w-5`}
			}
		}
	}
	nav {
		${tw`flex bg-blue-50 justify-center`}
		a {
			${tw`
				py-1 px-3
				hover:bg-white
				cursor-pointer 
				transition-colors duration-300 ease-in-out 
			`}
			&.active {
				${tw`border-b-2 border-gray-600`}
			}
		}
	}
`
