import tw, { styled, GlobalStyles } from "twin.macro"
import Footer from "../components/Footer"
import Header from "../components/Header"

function MyApp({ Component, pageProps }) {
	return (
		<StyledApp>
			<GlobalStyles />
			<Header />
			<main>
				<Component {...pageProps} />
			</main>
			{/* <Footer /> */}
		</StyledApp>
	)
}

const StyledApp = styled.div`
	${tw`bg-white dark:bg-black min-h-screen`}
	* {
		${tw`box-border text-black dark:text-white`}
	}
`

export default MyApp
