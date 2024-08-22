import React from "react"
import Link from "next/link"
import Image from "next/image"
import { siteData } from "../data/siteData"

function Header() {
	const links = [
		{ url: `tel:${siteData.phone}`, icon: "phone" },
		{ url: `mailto:${siteData.email}`, icon: "email" },
	]
	return (
		<header>
			<img
				src="/logos/light-logo.png"
				alt={siteData.name}
				className="dark:invert h-32 lg:h-40 transition-all duration-300 ease-in-out"
			/>
			<div className="flex gap-4">
				{/* add a phone and email icon here */}
				<div className="flex gap-4">
					{links?.map(({ url, icon }, idx) => (
						<Link
							href={url}
							className="header-link"
							key={idx}
							title={`${icon === "phone" ? "Call" : "Email"} us at ${url
								.replace("mailto:", "")
								.replace("tel:", "")}`}>
							<Image src={`${icon}.svg`} width={25} height={25} alt={icon} />
						</Link>
					))}
				</div>
			</div>
		</header>
	)
}

export default Header
