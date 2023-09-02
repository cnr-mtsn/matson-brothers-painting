import { siteData } from "@/data/siteData"
import "../styles/globals.css"
import Head from "next/head"

export default function App({ Component, pageProps }) {
	return (
		<main>
			<Head>
				<title>{siteData.name}</title>
				<meta name="description" content={siteData.description} />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicons/favicon.ico" />
			</Head>
			<div className="min-h-[90vh] bg-[url('/images/landing-page.png')] bg-no-repeat bg-cover bg-blend-overlay bg-black bg-opacity-50 dark:bg-opacity-70">
				<Component {...pageProps} />
			</div>
		</main>
	)
}
