import OAuthClient from "intuit-oauth"

export default async function handler(req, res) {
	const oauthClient = new OAuthClient({
		clientId: process.env.QB_CLIENT_ID,
		clientSecret: process.env.QB_CLIENT_SECRET,
		environment: "production",
		redirectUri: req.headers.referer,
	})
	try {
		return res.status(200).json({
			message: `Token retrieved successfully!`,
		})
	} catch (error) {
		console.log("Error: ", error)
		return res.status(500).json({
			message: `Sorry, there was a problem getting the token.`,
		})
	}
}
