import Hero from "@/components/Hero"
import ContactForm from "../components/ContactForm"
import ImageCarousel from "@/components/ImageCarousel"

export default function Home() {
	// create an array of image urls from photo-1.jpg to photo-58.jpg
	const images = Array.from(
		{ length: 58 },
		(_, i) => `/images/photo-${i + 1}.jpg`
	)
	return (
		<div className="flex flex-col justify-center p-8 min-h-[90vh]">
			<div className="flex flex-col lg:flex-row items-center justify-center w-full sm:w-[85%] mx-auto min-h-[60vh] gap-8 bg-black bg-opacity-20 dark:bg-opacity-0 p-10 lg:mt-16">
				<Hero className="flex flex-col gap-10 items-center justify-center w-full lg:w-1/2 text-center" />
				<ContactForm />
			</div>
			<div className="flex flex-col justify-center gap-6 w-full md:w-[80%] mx-auto mt-20">
				<h2 className="w-full border-b-2 border-white text-3xl text-white pb-4">
					Some of our work
				</h2>
				<ImageCarousel images={images} height={96} />
			</div>
		</div>
	)
}
