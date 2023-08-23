import React from "react"

function Email({ name, email, message }) {
	return (
		<div>
			<h1>{name}:</h1>
			<h2>{email}</h2>
			<p>{message}</p>
		</div>
	)
}

export default Email
