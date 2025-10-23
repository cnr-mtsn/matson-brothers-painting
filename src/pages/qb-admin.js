'use client'

import { useState, useEffect } from "react"
import Head from "next/head"
import { siteData } from "../data/siteData"

export default function QBAdmin() {
	const [refreshing, setRefreshing] = useState(false)
	const [refreshMessage, setRefreshMessage] = useState("")
	const [origin, setOrigin] = useState("")

	useEffect(() => {
		// Set the origin only on the client side to avoid hydration mismatch
		setOrigin(window.location.origin)
	}, [])

	const handleRefreshToken = async () => {
		setRefreshing(true)
		setRefreshMessage("")

		try {
			const response = await fetch("/api/qb/refresh-token")
			const data = await response.json()

			if (response.ok) {
				setRefreshMessage(`✓ ${data.message} Token expires in ${data.expires_in_hours} hours.`)
			} else {
				setRefreshMessage(`✗ ${data.message}`)
			}
		} catch (error) {
			setRefreshMessage("✗ Error refreshing token")
		} finally {
			setRefreshing(false)
		}
	}

	return (
		<>
			<Head>
				<title>{`QuickBooks Admin | ${siteData.name}`}</title>
			</Head>

			<main className="min-h-screen bg-stone-50 dark:bg-stone-900 py-16 px-6">
				<div className="max-w-3xl mx-auto">
					<h1 className="text-4xl font-bold mb-8 text-stone-900 dark:text-white">
						QuickBooks Integration
					</h1>

					<div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8 mb-6">
						<h2 className="text-2xl font-bold mb-4 text-stone-900 dark:text-white">
							Connect to QuickBooks
						</h2>
						<p className="text-stone-600 dark:text-stone-400 mb-6">
							Connect your QuickBooks account to enable invoice lookup on the payment page.
						</p>

						<div className="space-y-4">
							<a
								href="/api/qb/auth"
								className="inline-block px-8 py-4 bg-[#2CA01C] text-white font-bold rounded-lg hover:bg-[#228B16] transition-colors"
							>
								Connect to QuickBooks
							</a>

							<div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
								<p className="text-sm text-blue-800 dark:text-blue-300">
									<strong>Note:</strong> Before connecting, make sure you've added the redirect URI to your QuickBooks app settings in the developer dashboard:
								</p>
								{origin && (
									<code className="block mt-2 p-2 bg-white dark:bg-stone-700 rounded text-xs">
										{origin}/api/qb/callback
									</code>
								)}
							</div>
						</div>
					</div>

					<div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8 mb-6">
						<h2 className="text-2xl font-bold mb-4 text-stone-900 dark:text-white">
							Refresh Access Token
						</h2>
						<p className="text-stone-600 dark:text-stone-400 mb-6">
							QuickBooks access tokens expire after 1 hour. Use this button to refresh your token.
						</p>

						<button
							onClick={handleRefreshToken}
							disabled={refreshing}
							className="px-8 py-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
						>
							{refreshing ? "Refreshing..." : "Refresh Token"}
						</button>

						{refreshMessage && (
							<div className={`mt-4 p-4 rounded-lg ${refreshMessage.startsWith('✓') ? 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20 text-red-800 dark:text-red-300'}`}>
								{refreshMessage}
							</div>
						)}
					</div>

					<div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8">
						<h2 className="text-2xl font-bold mb-4 text-stone-900 dark:text-white">
							Setup Instructions
						</h2>
						<ol className="space-y-4 text-stone-600 dark:text-stone-400">
							<li className="flex gap-3">
								<span className="font-bold text-brand-blue">1.</span>
								<div>
									<strong>Add Redirect URI in QuickBooks Developer Portal:</strong>
									<ul className="mt-2 ml-4 list-disc space-y-1">
										<li>Go to your app in the QuickBooks Developer Dashboard</li>
										<li>Click on "Keys & credentials"</li>
										<li>Under "Redirect URIs", add: {origin && <code className="bg-stone-100 dark:bg-stone-700 px-2 py-1 rounded">{origin}/api/qb/callback</code>}</li>
										<li>Save your changes</li>
									</ul>
								</div>
							</li>
							<li className="flex gap-3">
								<span className="font-bold text-brand-blue">2.</span>
								<div>
									<strong>Click "Connect to QuickBooks"</strong> above to authorize the connection
								</div>
							</li>
							<li className="flex gap-3">
								<span className="font-bold text-brand-blue">3.</span>
								<div>
									<strong>Your tokens will be automatically saved</strong> and the invoice lookup will work on the payment page
								</div>
							</li>
							<li className="flex gap-3">
								<span className="font-bold text-brand-blue">4.</span>
								<div>
									<strong>Refresh the token</strong> when it expires (every hour) using the button above
								</div>
							</li>
						</ol>
					</div>
				</div>
			</main>
		</>
	)
}
