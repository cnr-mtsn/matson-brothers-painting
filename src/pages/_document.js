import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { siteData } from "@/data/siteData"
import { Head, Html, Main, NextScript } from "next/document"
import Image from "next/image"
import Link from "next/link"

export default function Document() {
	const links = [
		{ url: `tel:${siteData.phone}`, icon: "phone" },
		{ url: `mailto:${siteData.email}`, icon: "email" },
	]
	return (
		<Html
			lang="en"
			className="bg-[url('/images/grunge-wall.png')] dark:bg-blend-overlay dark:bg-stone-900"
		>
			<Head />
			<div className="banner bg-white dark:bg-black bg-opacity-70">
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
						{icon === "phone" ? "Give us a call" : "Email us"}
					</Link>
				))}
			</div>
			<Header />
			<body>
				<Main />
				<NextScript />
			</body>
			<Footer />
		</Html>
	)
}
