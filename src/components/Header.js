import { siteData } from "../data/siteData"

function Header() {
	return (
		<header>
			<img
				src="/logos/light-logo-no-bg.png"
				alt={siteData.name}
				className="header-logo"
			/>
		</header>
	)
}

export default Header
