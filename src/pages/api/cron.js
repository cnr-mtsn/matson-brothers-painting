import { getTokenData, saveTokenData } from "@/utils/quickbooks"
import OAuthClient from "intuit-oauth"

export default async function handler(req, res) {
	// Verify this request is from Vercel Cron
	const authHeader = req.headers.authorization
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return res.status(401).json({ error: 'Unauthorized' })
	}

	try {
		// Read stored tokens
		const tokenData = await getTokenData()

		if (!tokenData) {
			console.log('No tokens found to refresh')
			return res.status(404).json({
				message: 'No stored tokens found. Please connect to QuickBooks first.',
			})
		}

		const useProduction = process.env.QB_ENVIRONMENT === 'production'

		const oauthClient = new OAuthClient({
			clientId: useProduction ? process.env.QB_PROD_CLIENT_ID : process.env.QB_DEV_CLIENT_ID,
			clientSecret: useProduction ? process.env.QB_PROD_CLIENT_SECRET : process.env.QB_DEV_CLIENT_SECRET,
			environment: useProduction ? 'production' : 'sandbox',
			redirectUri: process.env.QB_REDIRECT_URI || 'https://matsonbrotherspainting.com/api/qb/callback',
		})

		// Set the existing token
		oauthClient.setToken({
			access_token: tokenData.access_token,
			refresh_token: tokenData.refresh_token,
			token_type: tokenData.token_type,
			expires_in: tokenData.expires_in,
			x_refresh_token_expires_in: tokenData.x_refresh_token_expires_in,
			realmId: tokenData.realm_id,
		})

		// Refresh the token
		console.log('🔄 [CRON] Refreshing QuickBooks access token...')
		const authResponse = await oauthClient.refresh()
		const newToken = authResponse.getJson()

		// Update stored tokens
		const updatedTokenData = {
			access_token: newToken.access_token,
			refresh_token: newToken.refresh_token,
			expires_in: newToken.expires_in,
			x_refresh_token_expires_in: newToken.x_refresh_token_expires_in,
			token_type: newToken.token_type,
			created_at: Date.now(),
			realm_id: tokenData.realm_id,
		}

		await saveTokenData(updatedTokenData)

		console.log('✅ [CRON] Token refreshed successfully!')

		return res.status(200).json({
			message: 'Token refreshed successfully!',
			timestamp: new Date().toISOString(),
			expires_in_hours: Math.round(newToken.expires_in / 3600),
		})
	} catch (error) {
		console.error('❌ [CRON] Error refreshing token:', error)
		return res.status(500).json({
			message: 'Error refreshing token',
			error: error.message,
		})
	}
}
