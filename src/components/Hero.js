import { siteData } from "../data/siteData"

export default function Hero({ className }) {
	return (
		<div className={className}>
			<h1 className="text-white text-3xl md:text-5xl leading-[2.5rem] md:leading-[4rem]">
				{siteData.slogan}
			</h1>
			<p className="text-xl md:text-2xl text-gray-100">
				{siteData.description}
			</p>
		</div>
	)
}
