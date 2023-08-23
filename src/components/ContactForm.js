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
	const [response, setResponse] = useState({})

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prevState => ({
			...prevState,
			[name]: value,
		}))
	}

	const handleSubmit = async () => {
		console.log("Submit form: ", formData)
		await fetch("/api/contact", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then(res => {
				console.log("Response: ", res)
				if (res.status === 200) {
					setSubmitted(true)
					setFormData(initialFormData)
					return res.json()
				}
			})
			.then(data => setResponse(data))
			.catch(err => console.log("Error: ", err))
	}
	if (submitted)
		return (
			<div className="border-8 border-blue-400 py-6 px-4 rounded-sm flex flex-col gap-4 w-full lg:w-1/3 rounded-md">
				<h1 className="text-white">{response.message}</h1>
			</div>
		)
	return (
		<form
			className="border-8 border-blue-400 py-6 px-4 rounded-sm flex flex-col gap-4 w-full lg:w-1/3 rounded-md"
			name="Contact"
		>
			<h1 className="text-2xl font-bold text-white">
				{"Let's work together"}
			</h1>
			<input
				onChange={handleInputChange}
				required
				className="w-auto p-2 bg-opacity-80 bg-white text-black"
				type="text"
				name="name"
				id="name"
				placeholder="name"
			/>
			<input
				onChange={handleInputChange}
				required
				className="w-auto p-2 bg-opacity-80 bg-white text-black"
				type="email"
				name="email"
				id="email"
				placeholder="email"
			/>
			<textarea
				onChange={handleInputChange}
				required
				className="w-auto p-2 bg-opacity-80 bg-white text-black"
				name="message"
				id="message"
				placeholder="message"
			/>
			<button
				onClick={handleSubmit}
				className="w-auto mr-auto bg-blue-400 py-2 px-8 rounded-sm hover:bg-blue-400"
			>
				Send
			</button>
		</form>
	)
}

export default ContactForm
