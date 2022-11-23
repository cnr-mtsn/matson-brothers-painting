export default {
	name: "site",
	title: "Site Settings",
	type: "document",
	fields: [
		{
			name: "title",
			title: "Title",
			type: "string",
		},
		{
			name: "url",
			title: "URL",
			type: "url",
		},
		{
			name: "mainImage",
			title: "Main image",
			type: "image",
			options: {
				hotspot: true,
			},
		},
		{
			name: "email",
			title: "Email",
			type: "string",
		},
		{
			name: "phone",
			title: "Phone",
			type: "string",
		},
		{
			name: "address",
			title: "Address",
			type: "string",
		},
	],
	preview: {
		select: {
			title: "title",
			media: "mainImage",
		},
	},
}
