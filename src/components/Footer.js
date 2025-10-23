import { siteData } from "@/data/siteData"
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="footer">
			<div className="footer-content">
				{/* Top Section */}
				<div className="footer-top">
					<div className="footer-column">
						<img
							src="/logos/new-logo-no-bg.png"
							alt={siteData.name}
							className="footer-logo"
						/>
						<p className="footer-tagline">
							Legacy in Every Brushstroke
						</p>
						<p className="footer-description">
							Serving Oak Grove, MO and surrounding areas since 1987 with professional painting services.
						</p>
					</div>

					<div className="footer-column">
						<h3 className="footer-heading">Quick Links</h3>
						<nav className="footer-nav">
							<Link href="/" className="footer-link">Home</Link>
							<Link href="/portfolio" className="footer-link">Portfolio</Link>
							<Link href="/#contact" className="footer-link">Get a Quote</Link>
							<Link href="/pay" className="footer-link">Pay Invoice</Link>
						</nav>
					</div>

					<div className="footer-column">
						<h3 className="footer-heading">Services</h3>
						<ul className="footer-list">
							<li>Interior Painting</li>
							<li>Exterior Painting</li>
							<li>Cabinet Refinishing</li>
							<li>Commercial Projects</li>
						</ul>
					</div>

					<div className="footer-column">
						<h3 className="footer-heading">Contact Us</h3>
						<div className="footer-contact">
							<a href={`tel:${siteData.phone}`} className="footer-contact-item">
								<Image
									src="/phone.svg"
									width={20}
									height={20}
									alt="Phone"
								/>
								<span>{siteData.phone}</span>
							</a>
							<a href={`mailto:${siteData.email}`} className="footer-contact-item">
								<Image
									src="/email.svg"
									width={20}
									height={20}
									alt="Email"
								/>
								<span>{siteData.email}</span>
							</a>
							<div className="footer-contact-item">
								<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
									<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
								</svg>
								<span>Oak Grove, MO</span>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="footer-bottom">
					<div className="footer-bottom-content">
						<p className="footer-copyright">
							&copy; {currentYear} {siteData.name}. All rights reserved.
						</p>
						<p className="footer-credit">
							Built with care for quality craftsmanship
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
