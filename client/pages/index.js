import tw, { styled } from "twin.macro"
import client from "@lib/sanity"
import Page from "components/Page"
import { groq } from "next-sanity"

export default function Home({ pageData }) {
	return (
		<Page title={pageData.title} description={pageData}>
			<StyledHomePageContent>
				<p className="description">{pageData.description}</p>
				<div className="contact-info">
					<p>
						Email:{" "}
						<a href={`mailto:${pageData.email}`}>
							{pageData.email}
						</a>
					</p>
					<p>
						Text:{" "}
						<a href={`tel:${pageData.phone}`}>{pageData.phone}</a>
					</p>
				</div>
			</StyledHomePageContent>
		</Page>
	)
}

const siteQuery = groq`
	*[_type == 'site'] {
		title,
		description,
		email,
		phone,
		mainImage
	}
`

const StyledHomePageContent = styled.div`
	${tw`flex flex-col items-center max-w-[95%] md:max-w-[75%] mx-auto`}
	.description {
		${tw`text-center text-lg md:text-xl`}
	}
	.contact-info {
		${tw`mt-6 bg-gray-200 dark:bg-gray-800 p-4 rounded-md text-left`}
	}
`

export async function getStaticProps() {
	const pageData = await client.fetch(siteQuery)
	return {
		props: {
			pageData: pageData[0],
		},
		revalidate: 60,
	}
}
