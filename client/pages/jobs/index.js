import { groq } from "next-sanity"
import Page from "components/Page"
import client from "@lib/sanity"
import Link from "next/link"

export default function AllJobs({ jobs }) {
	console.log("Jobs: ", jobs)
	return jobs.length > 0 ? (
		<Page title="All Posts">
			<div tw="flex flex-col gap-2">
				{jobs?.map(({ title, slug }) => (
					<Link key={title} href={`/jobs/${slug.current}`}>
						{title}
					</Link>
				))}
			</div>
		</Page>
	) : (
		<Page title="No jobs yet..." />
	)
}

export async function getStaticProps() {
	const jobsQuery = groq`*[_type == "job"] | order(_createdAt asc)`
	const jobs = await client.fetch(jobsQuery)
	return {
		props: {
			jobs,
		},
		revalidate: 60,
	}
}
