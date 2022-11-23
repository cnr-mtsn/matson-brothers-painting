import client from "@lib/sanity"
import { groq } from "next-sanity"
import { PortableText } from "@portabletext/react"
import Page from "components/Page"

export default function about({ pageData }) {
	return (
		<Page title={pageData.title}>
			<PortableText value={pageData.textContent} />
		</Page>
	)
}

const query = groq`
	*[_type == "page" && slug.current == "about"] {
		title,
		_createdAt,
		textContent,
		mainImage
	}
`

export async function getStaticProps() {
	const [pageData] = await client.fetch(query)

	return {
		props: {
			pageData,
		},
		revalidate: 60,
	}
}
