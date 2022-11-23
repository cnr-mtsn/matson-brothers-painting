import client from "@lib/sanity"
import { PortableText } from "@portabletext/react"
import Page from "components/Page"
import { groq } from "next-sanity"

export default function Home({ pageData }) {
	return (
		<Page title={pageData.title}>
			<PortableText value={pageData.textContent} />
		</Page>
	)
}

const pageQuery = groq`
	*[_type == "page" && slug.current == "/"] {
		title,
		_createdAt,
		mainImage,
		textContent
	}
`

export async function getStaticProps() {
	const pageData = await client.fetch(pageQuery)
	return {
		props: {
			pageData: pageData[0],
		},
		revalidate: 60,
	}
}
