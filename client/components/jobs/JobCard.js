import Image from "next/image"
import tw, { styled } from "twin.macro"
import { useNextSanityImage } from "next-sanity-image"
import client from "@lib/sanity"
import Link from "next/link"
import MyImage from "components/MyImage"

export default function JobCard({ job }) {
	const imageProps = useNextSanityImage(client, job?.mainImage)

	return (
		<StyledJobCard href={`/jobs/${job.slug.current}`}>
			<h1>{job.title}</h1>
			<MyImage src={job.mainImage} />
		</StyledJobCard>
	)
}
const StyledJobCard = styled.a`
	${tw`shadow-md border flex flex-col p-2 items-center`}
	h1 {
		${tw`text-2xl text-center pb-2`}
	}
`
