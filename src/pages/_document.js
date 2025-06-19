import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { siteData } from "@/data/siteData"
import { Head, Html, Main, NextScript } from "next/document"
import Image from "next/image"
import Link from "next/link"

export default function Document() {
	
	return (
		<Html
			lang="en"
			className="bg-[url('/images/grunge-wall.png')] dark:bg-blend-overlay dark:bg-stone-800"
		>
			<Head />
			<Header />
			<body>
				<Main />
				<NextScript />
			</body>
			<Footer />
		</Html>
	)
}
