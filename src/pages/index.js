import ContactForm from "../components/ContactForm"
import { siteData } from "../data/siteData"

export default function Home() {
	return (
		<main className="bg-[url('/images/landing-page.jpg')] bg-no-repeat bg-cover bg-blend-overlay bg-black bg-opacity-70 flex flex-col lg:flex-row items-center justify-around gap-4">
			<div className="flex flex-col gap-10 items-center justify-center w-full lg:w-1/2 text-center">
				<h1 className="text-white text-5xl leading-[4rem]">
					Crafting Dreams, Building Homes: Where{" "}
					<span className="text-brand-red underline">Vision</span>{" "}
					Becomes{" "}
					<span className="text-brand-red underline">Reality</span>
				</h1>
				<p className="text-2xl text-gray-100">{siteData.description}</p>
			</div>
			<ContactForm />
		</main>
	)
}
