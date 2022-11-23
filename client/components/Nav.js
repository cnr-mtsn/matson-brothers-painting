import tw, { styled } from "twin.macro"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import HamburgerIcon from "./icons/HamburgerIcon"
import CloseIcon from "./icons/CloseIcon"

export default function Nav() {
	const [pages, setPages] = useState([])
	const [isOpen, setIsOpen] = useState(false)

	const { pathname } = useRouter()

	useEffect(() => {
		fetch("/api/pages")
			.then(res => res.json())
			.then(data => {
				setPages(data)
			})
			.catch(err => console.log(err))
	}, [])

	const Icon = isOpen ? <CloseIcon /> : <HamburgerIcon />
	const NavButton = () => (
		<button className="close-button" onClick={() => setIsOpen(!isOpen)}>
			{Icon}
		</button>
	)

	return (
		<StyledNav open={isOpen}>
			<NavButton />
			{pages?.map(
				({ title, slug }) =>
					slug.current !== "/" && (
						<a
							key={title}
							href={slug.current}
							className={
								pathname === slug.current ? "active" : null
							}>
							{title}
						</a>
					)
			)}
		</StyledNav>
	)
}
const StyledNav = styled.nav`
	${tw`
        fixed top-0 bottom-0
        pt-20 md:pt-0
        bg-white dark:bg-black
        flex flex-col border-l-2 shadow-xl

        md:static md:flex-row md:shadow-none md:border-none
        transition-all duration-500 ease-in-out
    `}
	${({ open }) => (open ? tw`right-0` : tw`-right-full`)}
    button.close-button {
		${tw`fixed top-6 right-2 md:hidden`}
	}
	svg {
		${tw`w-8 h-8`}
	}
	a {
		${tw`
            py-2 pl-4 pr-8 md:px-4 mx-1
			hover:bg-gray-100 dark:hover:bg-gray-600 
            cursor-pointer 
            transition-all duration-300 ease-in-out
			text-gray-900 dark:text-gray-100
        `}
		&.active {
			${tw`border-b-2 border-gray-600`}
		}
	}
`
