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

	const handleSubmit = async e => {
		e.preventDefault()
		console.log("Submit form: ", formData)
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
			console.log("Response: ", response)

			if (response.status === 200) {
				setSubmitted(true)
				setFormData(initialFormData)
				const data = await response.json()
				setResponse(data)
			}
		} catch (error) {
			console.log("Error: ", error)
		}
	}

	if (submitted)
		return (
			<div className="border-t-2 border-b-2 border-brand-red py-6 px-4 rounded-sm flex flex-col gap-4 w-full lg:w-1/3 rounded-md">
				<p className="text-white text-center">{response.message}</p>
			</div>
		)
	return (
		<form
			onSubmit={handleSubmit}
			className="border-t-2 border-b-2 border-brand-red py-6 px-4 rounded-sm flex flex-col gap-4 w-full lg:w-1/3 rounded-md bg-white dark:bg-black bg-opacity-10 dark:bg-opacity-50"
			name="Contact"
		>
			<h1 className="text-2xl font-bold text-white text-center">
				{"Let's work together"}
			</h1>
			<input
				onChange={handleInputChange}
				required
				className="w-auto p-2 bg-opacity-90 bg-white text-black focus:outline-brand-red focus:outline-2 hover:bg-opacity-90 transition-all duration-300 ease-in-out"
				type="text"
				name="name"
				id="name"
				placeholder={"name".charAt(0).toUpperCase() + "name".slice(1)}
			/>
			<input
				onChange={handleInputChange}
				required
				className="w-auto p-2 bg-opacity-90 bg-white text-black focus:outline-brand-red focus:outline-2 hover:bg-opacity-90 transition-all duration-300 ease-in-out"
				type="email"
				name="email"
				id="email"
				placeholder={"email".charAt(0).toUpperCase() + "email".slice(1)}
			/>
			<textarea
				onChange={handleInputChange}
				required
				className="w-auto p-2 bg-opacity-90 bg-white text-black focus:outline-brand-red focus:outline-2 hover:bg-opacity-90 transition-all duration-300 ease-in-out"
				name="message"
				id="message"
				placeholder={
					"message".charAt(0).toUpperCase() + "message".slice(1)
				}
			/>
			<input
				type="submit"
				value="Send"
				className="w-auto mx-auto bg-brand-blue text-white dark:bg-brand-red py-2 px-20 rounded-sm hover:brightness-110 cursor-pointer transition-all duration-300 ease-in-out"
			/>
		</form>
	)
}

export default ContactForm
