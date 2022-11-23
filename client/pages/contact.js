import client from "@lib/sanity"
import Page from "components/Page"

export default function Contact({ data }) {
	console.log("data: ", data)
	return <Page title={data.title} />
}

export async function getStaticProps() {
	const data = await client.fetch(
		`*[_type == "page" && slug.current == "contact"][0]`
	)
	return {
		props: {
			data,
		},
	}
}
