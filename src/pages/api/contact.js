import nodemailer from "nodemailer"
import Email from "../../components/Email"

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
})
export default async function handler(req, res) {
	// send a message to the user after submitting a contact form
	const { name, email, message } = req.body
	const emailHtml = <Email name={name} email={email} message={message} />
	const options = {
		from: email,
		to: process.env.EMAIL_USER,
		subject: `New message from ${name}`,
		html: emailHtml,
	}
	console.log(
		"Sending email from",
		email,
		"to",
		process.env.EMAIL_USER,
		"with options",
		options
	)
	// await transporter
	// 	.sendMail(options)
	// 	.then(res => console.log("Nodemailer response: ", res))
	res.status(200).json({
		message: "Thank you for reaching out to Sims Custom Homes!",
	})
}
