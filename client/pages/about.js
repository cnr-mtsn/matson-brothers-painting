import client from "@lib/sanity"
import { groq } from "next-sanity"
import { PortableText } from "@portabletext/react"
import Page from "components/Page"

export default function about({ pageData }) {
	console.log("Page Data:", pageData)
	return (
		<Page>
			<h1>{pageData.title}</h1>
			<PortableText value={pageData.textContent} />
		</Page>
	)
}

const query = groq`
	*[_type == "page" && slug.current == "about-us"] {
		title,
		_createdAt,
		textContent,
		mainImage
	}
`

export async function getServerSideProps() {
	const [pageData] = await client.fetch(query)

	return {
		props: {
			pageData,
		},
	}
}
