import Page from "components/Page"
import client from "@lib/sanity"
import { groq } from "next-sanity"
import MyPortableText from "components/MyPortableText"
import MyImage from "components/MyImage"
import tw, { styled } from "twin.macro"

export default function Slug({ job }) {
	return (
		<Page>
			<div tw="flex items-center gap-6">
				<MyImage src={job.mainImage} />
				<div tw="flex flex-col w-1/2 gap-4">
					<h1 tw="text-lg font-bold">{job.title}</h1>
					<MyPortableText content={job.body} />
				</div>
			</div>
		</Page>
	)
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
	const job = await client.fetch(
		groq`*[_type == "job" && slug.current == $slug][0]`,
		{ slug: params.slug }
	)

	console.log("Params: ", params)
	return {
		props: {
			job,
		},
		revalidate: 60,
	}
}
