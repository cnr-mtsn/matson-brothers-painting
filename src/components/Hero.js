import { siteData } from "../data/siteData"
import HighlightedText from "./HighlightedText"

export default function Hero({ className }) {
	return (
		<div className={className}>
			<h1 className="text-3xl md:text-5xl leading-[2.5rem] md:leading-[4rem]">
				<HighlightedText
					text={siteData.slogan}
					wordsToHighlight={["Legacy"]}
				/>
			</h1>
			<p className="text-xl md:text-2xl">{siteData.description}</p>
		</div>
	)
}
