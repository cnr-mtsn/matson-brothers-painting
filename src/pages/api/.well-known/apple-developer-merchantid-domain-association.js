export default async function handler(req, res) {
	// return the file from .well-known/apple-developer-merchantid-domain-association
	return res
		.status(200)
		.sendFile(".well-known/apple-developer-merchantid-domain-association")
}
