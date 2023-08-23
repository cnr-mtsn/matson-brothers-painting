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
			<Image
				src="/logos/logo-no-bg.png"
				width={180}
				height={60}
				alt={siteData.name}
			/>
			<div className="flex gap-4">
				<nav>
					{/* {['Home', 'About','Contact'].map((page) => <Link className="header-link" key={page} href={`/${page === 'Home' ? "/" : page.toLowerCase()}`}>{page}</Link>)} */}
				</nav>
				{/* add a phone and email icon here */}
				<div className="flex gap-4">
					{links?.map(({ url, icon }, idx) => (
						<Link
							href={url}
							className="header-link"
							key={idx}
							title={`${
								icon === "phone" ? "Call" : "Email"
							} us at ${url
								.replace("mailto:", "")
								.replace("tel:", "")}`}
						>
							<Image
								src={`${icon}.svg`}
								width={25}
								height={25}
								alt={icon}
							/>
						</Link>
					))}
				</div>
			</div>
		</header>
	)
}

export default Header
