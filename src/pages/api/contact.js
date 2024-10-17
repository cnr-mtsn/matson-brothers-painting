import { siteData } from "@/data/siteData"
import nodemailer from "nodemailer"

export default async function handler(req, res) {
	const { name, email, message } = req.body

	const user =
		process.env.NODE_ENV === "development"
			? process.env.NEXT_PUBLIC_DEV_EMAIL_FROM_USER
			: process.env.NEXT_EMAIL_FROM_USER
	const pass =
		process.env.NODE_ENV === "development"
			? process.env.NEXT_PUBLIC_DEV_EMAIL_PASSWORD
			: process.env.NEXT_EMAIL_PASSWORD
	const recipient =
		process.env.NODE_ENV === "development"
			? process.env.NEXT_PUBLIC_DEV_EMAIL_TO_USER
			: process.env.NEXT_EMAIL_TO_USER

	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user,
			pass,
		},
	})

	try {
		await transporter.sendMail({
			from: user,
			to: recipient,
			replyTo: email,
			subject: `Contact form submission from [${name}]`,
			html: `
				<head>
					<style>
						body {
							display: flex;
							flex-direction: column;
							gap: 1.5rem;
						}
						h1 {
							font-size: 1rem;
							font-weight: semi-bold;
							color: #000;
						}
						p {
							font-size: .8rem;
							color: #000;
							display: flex;
							flex-direction: column;
							gap: 0.3rem;
						}
						span {
							font-size: .8rem;
						}
					</style>
				</head>
				<body>
					<h1>Name: <span>${name}</span></h1>
					<h1>Email: <span>${email}</span></h1>
					<h1>Message:</h1>
					<p>	
						<blockquote>
							- ${message}
						</blockquote>
					</p>
				</body>
			`,
		})
		return res.status(200).json({
			message: `Thank you for reaching out to ${siteData.name}!`,
		})
	} catch (error) {
		console.log("Error: ", error)
		return res.status(500).json({
			message: `Sorry ${name}, there was a problem sending your message.`,
		})
	}
}
