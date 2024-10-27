import Hero from "@/components/Hero"
import ContactForm from "../components/ContactForm"
import ImageCarousel from "@/components/ImageCarousel"

export default function Home() {
	// create an array of image urls from photo-1.jpg to photo-58.jpg
	const images = Array.from(
		{ length: 15 },
		(_, i) => `/images/photo-${i + 1}.jpg`
	)
	return (
		<div className="flex flex-col justify-center p-4 md:p-8 w-full md:w-[90%] mx-auto">
			<div className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-black bg-opacity-20 dark:bg-opacity-0 py-6 lg:mt-16">
				<Hero className="flex flex-col gap-10 items-center justify-center text-center w-full sm:w-3/4 md:w-2/3 lg:w-1/2" />
				<ContactForm />
			</div>
			<div className="flex flex-col justify-center gap-6 mt-20">
				<h2 className="w-full border-b-2 border-black dark:border-stone-500 text-3xl text-black dark:text-stone-500 pb-4">
					Some of our work
				</h2>
				<ImageCarousel images={images} height={96} />
			</div>
		</div>
	)
}
