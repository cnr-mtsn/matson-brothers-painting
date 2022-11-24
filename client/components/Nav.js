import tw, { styled } from "twin.macro"
import { useState } from "react"
import { useRouter } from "next/router"
import HamburgerIcon from "./icons/HamburgerIcon"
import CloseIcon from "./icons/CloseIcon"
import { navigation } from "@lib/utils"

export default function Nav() {
	const [isOpen, setIsOpen] = useState(false)

	const { pathname } = useRouter()

	// useEffect(() => {
	// 	console.count("Nav useEffect ran!")
	// 	fetch("/api/pages")
	// 		.then(res => res.json())
	// 		.then(data => {
	// 			setPages(data)
	// 		})
	// 		.catch(err => console.log(err))
	// }, [])

	const NavButton = () => (
		<button className="close-button" onClick={() => setIsOpen(!isOpen)}>
			{isOpen ? <CloseIcon /> : <HamburgerIcon />}
		</button>
	)

	const NavPages = () =>
		navigation.pages
			.filter(({ path }) => path !== "/")
			.map(({ path, title }) => (
				<a
					key={title}
					href={path}
					className={pathname === path ? "active" : null}>
					{title}
				</a>
			))

	return (
		<StyledNav open={isOpen}>
			<NavButton />
			<NavPages />
		</StyledNav>
	)
}
const StyledNav = styled.nav`
	${tw`
        fixed top-0 bottom-0 z-10
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
        `}
		&.active {
			${tw`border-b-2 border-gray-600`}
		}
	}
`
