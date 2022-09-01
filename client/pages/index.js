import client from "@lib/sanity"
import Page from "components/Page"
import { groq } from "next-sanity"

export default function Home({ posts, pageData }) {
	console.log("Posts:", posts)
	console.log("Page Data:", pageData)
	return (
		<Page>
			<h1>{pageData.title}</h1>
			{posts?.map(({ title, _createdAt }) => (
				<p key={_createdAt}>{title}</p>
			))}
		</Page>
	)
}

const postsQuery = groq`
	*[_type == "post"] | order(_createdAt desc) {
		title,
		_createdAt,
	}
`
const pageQuery = groq`
	*[_type == "page" && slug.current == "homepage"] {
		title,
		_createdAt,
		mainImage,
		textContent
	}
`

export async function getStaticProps() {
	const posts = await client.fetch(postsQuery)
	const pageData = await client.fetch(pageQuery)
	return {
		props: {
			posts,
			pageData: pageData[0],
		},
		revalidate: 60,
	}
}
