import OAuthClient from "intuit-oauth"
import fs from 'fs'
import path from 'path'
import { saveTokenData } from "@/utils/quickbooks"

export default async function handler(req, res) {
	try {
		const parseRedirect = req.url

		// Use QB_ENVIRONMENT to determine if we're using production or sandbox QuickBooks
		const useProduction = process.env.QB_ENVIRONMENT === 'production'

		const oauthClient = new OAuthClient({
			clientId: useProduction ? process.env.QB_PROD_CLIENT_ID : process.env.QB_DEV_CLIENT_ID,
			clientSecret: useProduction ? process.env.QB_PROD_CLIENT_SECRET : process.env.QB_DEV_CLIENT_SECRET,
			environment: useProduction ? 'production' : 'sandbox',
			redirectUri: `${req.headers.origin || 'https://matsonbrotherspainting.com'}/api/qb/callback`,
		})

		// Exchange authorization code for tokens
		const authResponse = await oauthClient.createToken(parseRedirect)
		const token = authResponse.getJson()

		// Get company info (realm ID)
		const companyId = oauthClient.getToken().realmId

		console.log('QuickBooks Connected Successfully!')
		console.log('Company ID:', companyId)
		console.log('Access Token (first 20 chars):', token.access_token.substring(0, 20) + '...')

		// Store tokens in a file (you can change this to a database later)
		const tokenData = {
			access_token: token.access_token,
			refresh_token: token.refresh_token,
			expires_in: token.expires_in,
			x_refresh_token_expires_in: token.x_refresh_token_expires_in,
			token_type: token.token_type,
			created_at: Date.now(),
			realm_id: companyId,
		}

		// Save tokens to KV storage or file
		await saveTokenData(tokenData)

		// Return HTML page with success message and instructions
		return res.status(200).send(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>QuickBooks Connected</title>
					<style>
						body {
							font-family: system-ui, -apple-system, sans-serif;
							max-width: 600px;
							margin: 100px auto;
							padding: 20px;
							background: #f5f5f5;
						}
						.card {
							background: white;
							padding: 30px;
							border-radius: 10px;
							box-shadow: 0 2px 10px rgba(0,0,0,0.1);
						}
						h1 {
							color: #2CA01C;
							margin-top: 0;
						}
						.token-box {
							background: #f8f9fa;
							padding: 15px;
							border-radius: 5px;
							margin: 20px 0;
							word-break: break-all;
							font-family: monospace;
							font-size: 12px;
						}
						.label {
							font-weight: bold;
							color: #666;
							margin-bottom: 5px;
						}
						.success {
							color: #2CA01C;
							font-weight: bold;
						}
						.instructions {
							background: #fff3cd;
							border-left: 4px solid #ffc107;
							padding: 15px;
							margin: 20px 0;
						}
						button {
							background: #2563eb;
							color: white;
							border: none;
							padding: 10px 20px;
							border-radius: 5px;
							cursor: pointer;
							font-size: 16px;
						}
						button:hover {
							background: #1d4ed8;
						}
					</style>
				</head>
				<body>
					<div class="card">
						<h1>QuickBooks Connected Successfully!</h1>
						<p class="success">Your application is now connected to QuickBooks.</p>

						<div class="token-box">
							<div class="label">Access Token (first 50 chars):</div>
							${token.access_token.substring(0, 50)}...
						</div>

						<div class="token-box">
							<div class="label">Company/Realm ID:</div>
							${companyId}
						</div>

						<div class="instructions">
							<strong>✅ Tokens Saved Successfully!</strong>
							<p>Your QuickBooks tokens have been saved to ${process.env.QB_TOKENS_KV_REST_API_URL && process.env.QB_TOKENS_KV_REST_API_TOKEN ? 'Vercel KV storage' : 'local file storage'}.</p>
							<ul style="text-align: left; margin: 20px 0;">
								<li>🚀 Access token will be automatically refreshed every hour</li>
								<li>🚀 No manual intervention needed</li>
								<li>🚀 Tokens are secure and persistent</li>
							</ul>
							<p><strong>Note:</strong> Refresh token expires in ${Math.round(token.x_refresh_token_expires_in / 86400)} days. You'll need to re-authenticate before then.</p>
						</div>

						<button onclick="window.location.href='/qb-admin'">Return to Admin</button>
						<script>
							// Auto-redirect after 3 seconds
							setTimeout(() => {
								window.location.href = '/qb-admin';
							}, 3000);
						</script>
					</div>
				</body>
			</html>
		`)
	} catch (error) {
		console.error('Error in QB callback:', error)
		return res.status(500).send(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>QuickBooks Connection Error</title>
					<style>
						body {
							font-family: system-ui, -apple-system, sans-serif;
							max-width: 600px;
							margin: 100px auto;
							padding: 20px;
						}
						.error {
							background: #fee;
							border-left: 4px solid #f00;
							padding: 20px;
							border-radius: 5px;
						}
					</style>
				</head>
				<body>
					<div class="error">
						<h1>Connection Error</h1>
						<p>There was an error connecting to QuickBooks:</p>
						<p><strong>${error.message}</strong></p>
					</div>
				</body>
			</html>
		`)
	}
}
