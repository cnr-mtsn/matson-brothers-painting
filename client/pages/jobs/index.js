import { groq } from "next-sanity"
import Page from "components/Page"
import client from "@lib/sanity"
import JobCard from "components/jobs/JobCard"

export default function AllJobs({ jobs }) {
	return (
		<Page>
			{jobs?.map(job => (
				<JobCard job={job} />
			))}
		</Page>
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
