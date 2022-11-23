import Image from "next/image"
import tw, { styled } from "twin.macro"
import { useNextSanityImage } from "next-sanity-image"
import client from "@lib/sanity"

export default function JobCard({ job }) {
	console.log(`Job: ${JSON.stringify(job, null, 2)}`)
	const imageProps = useNextSanityImage(client, job?.mainImage)

	const JobImage = () => (
		<div className="image">
			<Image {...imageProps} layout="fill" />
		</div>
	)
	return (
		<StyledJobCard>
			<h1>{job.title}</h1>
			<JobImage />
		</StyledJobCard>
	)
}
const StyledJobCard = styled.div`
	${tw`shadow-md rounded-md p-4 border w-max`}
	h1 {
		${tw`text-2xl dark:text-white text-center pb-2`}
	}
	.image {
		${tw`relative w-80 h-52`};
	}
`
