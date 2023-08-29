import { siteData } from "../data/siteData"
import HighlightedText from "./HighlightedText"

export default function Hero({ className }) {
	return (
		<div className={className}>
			<h1 className="text-white text-3xl md:text-5xl leading-[2.5rem] md:leading-[4rem]">
				<HighlightedText
					text={siteData.slogan}
					wordsToHighlight={["Vision", "Reality"]}
				/>
			</h1>
			<p className="text-xl md:text-2xl text-gray-100">
				{siteData.description}
			</p>
		</div>
	)
}
