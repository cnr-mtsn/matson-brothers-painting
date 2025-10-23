import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {

	return (
		<Html
			lang="en"
			className="bg-[url('/images/grunge-wall.png')] dark:bg-blend-overlay dark:bg-stone-800"
		>
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
