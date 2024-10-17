import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { siteData } from "@/data/siteData"
import { Head, Html, Main, NextScript } from "next/document"
import Image from "next/image"
import Link from "next/link"

export default function Document() {
	const links = [
		{ url: "/pay", label: "Pay", title: `Pay Now` },
		{
			url: `tel:${siteData.phone}`,
			icon: "phone",
			label: "Call",
			title: `Call us at ${siteData.phone}`,
		},
		{
			url: `mailto:${siteData.email}`,
			icon: "email",
			label: "Email",
			title: `Email us at ${siteData.email}`,
		},
	]
	return (
		<Html
			lang="en"
			className="bg-[url('/images/grunge-wall.png')] dark:bg-blend-overlay dark:bg-stone-900"
		>
			<Head />
			<div className="banner bg-white dark:bg-black bg-opacity-70">
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
			<Header />
			<body>
				<Main />
				<NextScript />
			</body>
			<Footer />
		</Html>
	)
}
