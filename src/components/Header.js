import Link from "next/link"
import { siteData } from "../data/siteData"

function Header() {
	return (
		<header>
			<Link href="/">
				<img
					src="/logos/light-logo-no-bg.png"
					alt={siteData.name}
					className="header-logo"
				/>
			</Link>
		</header>
	)
}

export default Header
