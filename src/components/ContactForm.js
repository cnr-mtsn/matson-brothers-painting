"use client"
import React, { useState } from "react"

function ContactForm() {
	const initialFormData = {
		name: "",
		email: "",
		message: "",
	}
	const [formData, setFormData] = useState(initialFormData)
	const [submitted, setSubmitted] = useState(false)
	const [loading, setLoading] = useState(false)
	const [response, setResponse] = useState({})

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prevState => ({
			...prevState,
			[name]: value,
		}))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		console.log("Submit form: ", formData)
		setLoading(true)
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
			console.log("Response: ", response)
			const data = await response.json()
			setResponse(data)
			if (response.status === 200) {
				setSubmitted(true)
				setLoading(false)
				setFormData(initialFormData)
			} else {
				setLoading(false)
				setSubmitted(true)
			}
		} catch (error) {
			console.log("Error: ", error)
			setLoading(false)
		}
	}

	return (
		<div className="border-t-2 border-b-2 border-blue-900 py-6 px-4 rounded-sm w-full rounded-md">
			{(loading || submitted) && (
				<p className="text-center">
					{loading ? "Sending..." : submitted ? response.message : ""}
				</p>
			)}
			{!loading && !submitted && (
				<form
					className="flex flex-col gap-4"
					onSubmit={handleSubmit}
					name="Contact"
				>
					<h1 className="text-2xl font-bold text-center">
						{"Let's work together"}
					</h1>
					<input
						onChange={handleInputChange}
						required						
						type="text"
						name="name"
						id="name"
						placeholder={"name".charAt(0).toUpperCase() + "name".slice(1)}
					/>
					<input
						onChange={handleInputChange}
						required
						type="email"
						name="email"
						id="email"
						placeholder={"email".charAt(0).toUpperCase() + "email".slice(1)}
					/>
					<textarea
						onChange={handleInputChange}
						required
						name="message"
						id="message"
						placeholder={
							"message".charAt(0).toUpperCase() +
							"message".slice(1)
						}
					/>
					<input
						type="submit"
						value="Send"
					/>
				</form>
			)}
		</div>
	)
}

export default ContactForm
