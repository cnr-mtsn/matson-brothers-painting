const HighlightedText = ({ text, wordsToHighlight }) =>
	text.split(" ").map((word, idx) =>
		wordsToHighlight.includes(word) ? (
			<span key={idx} className="text-brand-red underline">
				{word + " "}
			</span>
		) : (
			word + " "
		)
	)

export default HighlightedText
