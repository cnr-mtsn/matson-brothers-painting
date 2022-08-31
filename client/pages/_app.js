import tw, { GlobalStyles } from "twin.macro"
import Footer from "../components/Footer"
import Header from "../components/Header"

function MyApp({ Component, pageProps }) {
	return (
		<>
			<GlobalStyles />
			<Header />
			<main tw="min-h-[80vh]">
				<Component {...pageProps} />
			</main>
			{/* <Footer /> */}
		</>
	)
}

export default MyApp
