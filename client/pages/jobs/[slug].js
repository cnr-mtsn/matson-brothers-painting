import Page from "components/Page"
import client from "@lib/sanity"
import { groq } from "next-sanity"
import { PortableText } from "@portabletext/react"

export default function Slug({ job }) {
	console.log("Job: ", job)

	return <Page>Job page</Page>
}

export async function getStaticPaths() {
	const paths = await client.fetch(
		groq`*[_type == "job" && defined(slug.current)][].slug.current`
	)
	return {
		paths: paths.map(slug => ({ params: { slug } })),
		fallback: true,
	}
}

export async function getStaticProps({ params }) {
	const post = await client.fetch(
		groq`*[_type == "post" && slug.current == $slug][0]`,
		{ slug: params.slug }
	)
	return {
		props: {
			post,
		},
		revalidate: 60,
	}
}
