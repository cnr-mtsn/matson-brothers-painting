import Head from "next/head"
import Link from "next/link"
import { siteData } from "../data/siteData"
import ContactForm from "../components/ContactForm"
import Image from "next/image"

export default function Home() {
	const featuredProjects = [
		{ image: "/images/photo-1.png", title: "Modern Interior" },
		{ image: "/images/photo-2.png", title: "Exterior Excellence" },
		{ image: "/images/photo-3.png", title: "Living Spaces" },
		{ image: "/images/photo-4.png", title: "Curb Appeal" },
		{ image: "/images/photo-5.png", title: "Kitchen Refresh" },
		{ image: "/images/photo-6.png", title: "Complete Makeover" },
	]

	return (
		<>
			<Head>
				<title>{`${siteData.name} | Legacy in Every Brushstroke`}</title>
				<meta name="description" content={siteData.description} />
			</Head>

			<main className="home-page">
				{/* Hero Section */}
				<section className="hero-section">
					<div className="hero-overlay" />
					<div className="hero-content">
						<h1 className="hero-title">
							Legacy in Every <span className="hero-highlight">Brushstroke</span>
						</h1>
						<p className="hero-subtitle">
							Transforming homes in & around Oak Grove, MO since 1987
						</p>
						<div className="hero-stats">
							<div className="stat-item">
								<div className="stat-number">35+</div>
								<div className="stat-label">Years Experience</div>
							</div>
							<div className="stat-divider" />
							<div className="stat-item">
								<div className="stat-number">1000+</div>
								<div className="stat-label">Projects Completed</div>
							</div>
							<div className="stat-divider" />
							<div className="stat-item">
								<div className="stat-number">100%</div>
								<div className="stat-label">Satisfaction</div>
							</div>
						</div>
						<div className="hero-buttons">
							<a href="#contact" className="hero-btn primary">
								Get Free Quote
							</a>
							<Link href="/portfolio" className="hero-btn secondary">
								View Our Work
							</Link>
						</div>
					</div>
					<div className="hero-scroll-indicator">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M12 5v14M19 12l-7 7-7-7" />
						</svg>
					</div>
				</section>

				{/* Services Section */}
				<section className="services-section">
					<div className="section-container">
						<h2 className="section-title">Our Services</h2>
						<p className="section-subtitle">
							Comprehensive painting solutions for residential and commercial properties
						</p>
						<div className="services-grid">
							<div className="service-card">
								<div className="service-icon">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
									</svg>
								</div>
								<h3 className="service-title">Interior Painting</h3>
								<p className="service-description">
									Transform your living spaces with expert color consultation and flawless application. From single rooms to entire homes.
								</p>
							</div>
							<div className="service-card">
								<div className="service-icon">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M19 9.3V4h-3v2.6L12 3L2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2h-4z" />
									</svg>
								</div>
								<h3 className="service-title">Exterior Painting</h3>
								<p className="service-description">
									Protect and beautify your home's exterior with weather-resistant paints and professional techniques.
								</p>
							</div>
							<div className="service-card">
								<div className="service-icon">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z" />
									</svg>
								</div>
								<h3 className="service-title">Epoxied Floors</h3>
								<p className="service-description">
								Get beautiful, durable, and easy-to-clean floors with our professional epoxy floor coating services.
								</p>
							</div>
							<div className="service-card">
								<div className="service-icon">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z" />
									</svg>
								</div>
								<h3 className="service-title">Cabinet Refinishing</h3>
								<p className="service-description">
									Give your kitchen or bathroom a fresh new look without the cost of replacement. Expert refinishing services.
								</p>
							</div>
							<div className="service-card">
								<div className="service-icon">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
									</svg>
								</div>
								<h3 className="service-title">Commercial Projects</h3>
								<p className="service-description">
									Professional painting services for offices, retail spaces, and commercial buildings with minimal disruption.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Featured Work Section */}
				<section className="featured-section">
					<div className="section-container">
						<h2 className="section-title">Featured Projects</h2>
						<p className="section-subtitle">
							A glimpse into our portfolio of transformations
						</p>
						<div className="featured-grid">
							{featuredProjects.map((project, index) => (
								<div key={index} className="featured-item">
									<img src={project.image} alt={project.title} loading="lazy" />
									<div className="featured-overlay">
										<h3>{project.title}</h3>
									</div>
								</div>
							))}
						</div>
						<div className="text-center mt-12">
							<Link href="/portfolio" className="view-all-btn">
								View All Projects
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
							</Link>
						</div>
					</div>
				</section>

				{/* Why Choose Us Section */}
				<section className="why-choose-section">
					<div className="section-container">
						<h2 className="section-title">Why Choose Matson Brothers</h2>
						<div className="features-grid">
							<div className="feature-item">
								<div className="feature-icon">✓</div>
								<h3 className="feature-title">Family Legacy</h3>
								<p className="feature-text">
									Founded in 1987, we've built a reputation on trust, quality, and family values.
								</p>
							</div>
							<div className="feature-item">
								<div className="feature-icon">✓</div>
								<h3 className="feature-title">Expert Craftsmen</h3>
								<p className="feature-text">
									Our team brings over 25 years of combined experience to every project.
								</p>
							</div>
							<div className="feature-item">
								<div className="feature-icon">✓</div>
								<h3 className="feature-title">Quality Materials</h3>
								<p className="feature-text">
									We use only premium paints and materials for lasting, beautiful results.
								</p>
							</div>
							<div className="feature-item">
								<div className="feature-icon">✓</div>
								<h3 className="feature-title">Fair Pricing</h3>
								<p className="feature-text">
									Transparent quotes with no hidden fees. Quality work at competitive rates.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Contact Section */}
				<section id="contact" className="contact-section">
					<div className="section-container">
						<div className="contact-grid">
							<div className="contact-info">
								<h2 className="contact-title">Get Your Free Quote</h2>
								<p className="contact-text">
									Ready to transform your space? Fill out the form and we'll get back to you within 24 hours with a detailed quote.
								</p>
								<div className="contact-details">
									<div className="contact-detail-item">
										<div className="contact-detail-icon">
											<Image src="/phone.svg" width={24} height={24} alt="Phone" />
										</div>
										<div>
											<div className="contact-detail-label">Call Us</div>
											<a href={`tel:${siteData.phone}`} className="contact-detail-value">
												{siteData.phone}
											</a>
										</div>
									</div>
									<div className="contact-detail-item">
										<div className="contact-detail-icon">
											<Image src="/email.svg" width={24} height={24} alt="Email" />
										</div>
										<div>
											<div className="contact-detail-label">Email Us</div>
											<a href={`mailto:${siteData.email}`} className="contact-detail-value">
												{siteData.email}
											</a>
										</div>
									</div>
									<div className="contact-detail-item">
										<div className="contact-detail-icon">
											<svg viewBox="0 0 24 24" fill="currentColor">
												<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
											</svg>
										</div>
										<div>
											<div className="contact-detail-label">Location</div>
											<div className="contact-detail-value">Oak Grove, MO</div>
										</div>
									</div>
								</div>
							</div>
							<div className="contact-form-wrapper">
								<ContactForm />
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}
