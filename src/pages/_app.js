import "../styles/globals.css"
import Head from "next/head"

export default function App({ Component, pageProps }) {
	const metadata = {
		title: "Sims Custom Homes Inc.",
		description:
			"Sims Custom Homes Inc. is a family owned and operated business that has been building homes in the Kansas City area for over 30 years.",
	}

	return (
		<main>
			<Head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicons/favicon.ico" />
			</Head>
			<div className="min-h-[90vh] bg-[url('/images/landing-page.jpg')] bg-no-repeat bg-cover bg-blend-overlay bg-black bg-opacity-50 dark:bg-opacity-70">
				<Component {...pageProps} />
			</div>
		</main>
	)
}
