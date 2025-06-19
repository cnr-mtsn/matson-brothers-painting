export const siteData = {
	name: "Matson Brothers Painting, LLC",
	slogan: "Matson Brothers Painting: Legacy in Every Brushstroke.",
	ctaText:
		"Transform your home with a legacy of excellence. Book our experts today!",
	description:
		"Welcome to Matson Brothers Painting, LLC – your trusted partner in bringing color and elegance to homes in Oak Grove, MO, since 1987. Founded by the late George Clarence Matson III, our company now proudly upholds a legacy that blends time-honored traditions with modern innovation. We offer full service new home painting and repaints. With a team boasting over 25 years of experience, we don't just paint homes – we craft lasting impressions. Let the Matson legacy make a mark on your home's beauty.",
	phone: "(816) 442-9156",
	email: "conner@matsonbrotherspainting.com",
}

export const links = [
	{
		url: `tel:${siteData.phone}`,
		icon: "phone",
		label: "Call",
		title: `Call us at ${siteData.phone}`,
	},
	{
		url: `mailto:${siteData.email}`,
		icon: "email",
		label: "Email",
		title: `Email us at ${siteData.email}`,
	},
	{ url: "/pay", label: "Pay", title: `Pay Now` },
	// { url: "/jobs", label: "Jobs", title: `Apply for a job with us`}
]