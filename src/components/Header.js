import Link from "next/link"
import { siteData, links } from "../data/siteData"
import Image from "next/image"

function Header() {
	return (
		<header>
			<Link href="/">
				<img
					src="/logos/new-logo-no-bg.png"
					alt={siteData.name}
					className="header-logo"
				/>
			</Link>
			<div className="links ">
				{links?.map(({ url, icon, label, title }, idx) => (
					<Link
						href={url}
						className="header-link"
						key={idx}
						title={title}
					>
						{icon && (
							<Image
								src={`${icon}.svg`}
								width={25}
								height={25}
								alt={icon}
							/>
						)}
						{label}
					</Link>
				))}
			</div>
		</header>
	)
}

export default Header
