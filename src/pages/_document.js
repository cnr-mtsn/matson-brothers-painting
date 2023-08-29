import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
	return (
		<Html lang="en">
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
