'use client'

import { useState } from "react"
import Image from "next/image"
import Head from "next/head"
import { siteData } from "../data/siteData"

const portfolioItems = [
	{ id: 1, category: "exterior", title: "New Build - Oak Grove, MO", image: "/images/photo-1.png" },
	{ id: 2, category: "exterior", title: "New Build - Grain Valley, MO", image: "/images/photo-2.png" },
	{ id: 3, category: "interior", title: "Interior Repaint", image: "/images/photo-3.png" },
	{ id: 4, category: "exterior", title: "Front Door Repaint", image: "/images/photo-4.png" },
	{ id: 5, category: "interior", title: "New Build - Oak Grove, MO", image: "/images/photo-5.png" },
	{ id: 6, category: "interior", title: "New Build - Oak Grove, MO", image: "/images/photo-6.png" },
	{ id: 7, category: "interior", title: "New Build - Oak Grove, MO", image: "/images/photo-7.png" },
	{ id: 8, category: "interior", title: "New Build - Lee's Summit, MO", image: "/images/photo-8.png" },
	{ id: 9, category: "interior", title: "New Build - Holden, MO", image: "/images/photo-9.png" },
	{ id: 10, category: "interior", title: "New Build - Holden, MO", image: "/images/photo-10.png" },
	{ id: 11, category: "interior", title: "New Build - Holden, MO", image: "/images/photo-11.png" },
	{ id: 12, category: "interior", title: "Epoxied Floors", image: "/images/photo-12.png" },
	{ id: 13, category: "interior", title: "Epoxied Floors", image: "/images/photo-13.png" },
	{ id: 14, category: "interior", title: "Epoxied Floors", image: "/images/photo-14.png" },
	{ id: 15, category: "exterior", title: "Exterior Repaint", image: "/images/photo-15.png" },
	{ id: 16, category: "exterior", title: "New Build - Blue Springs, MO", image: "/images/photo-16.png" },
	{ id: 17, category: "interior", title: "Living Room Beams", image: "/images/photo-17.png" },
	{ id: 18, category: "interior", title: "Interior Repaint", image: "/images/photo-18.png" }
]

export default function Portfolio() {
	const [filter, setFilter] = useState("all")
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [selectedImage, setSelectedImage] = useState(null)

	const filteredItems = filter === "all"
		? portfolioItems
		: portfolioItems.filter(item => item.category === filter)

	const openLightbox = (item) => {
		setSelectedImage(item)
		setLightboxOpen(true)
		document.body.style.overflow = 'hidden'
	}

	const closeLightbox = () => {
		setLightboxOpen(false)
		setSelectedImage(null)
		document.body.style.overflow = 'unset'
	}

	const navigateLightbox = (direction) => {
		const currentIndex = portfolioItems.findIndex(item => item.id === selectedImage.id)
		const newIndex = direction === 'next'
			? (currentIndex + 1) % portfolioItems.length
			: (currentIndex - 1 + portfolioItems.length) % portfolioItems.length
		setSelectedImage(portfolioItems[newIndex])
	}

	return (
		<>
			<Head>
				<title>{`Our Portfolio | ${siteData.name}`}</title>
				<meta name="description" content="Browse our portfolio of interior and exterior painting projects. See the quality and craftsmanship that defines Matson Brothers Painting." />
			</Head>

			<main className="portfolio-page">
				{/* Hero Section */}
				<section className="portfolio-hero">
					<div className="portfolio-hero-content">
						<h1 className="portfolio-title">
							Our Work
						</h1>
						<p className="portfolio-subtitle">
							Showcasing over 35 years of excellence in painting. Each project represents our commitment to quality, precision, and transforming spaces.
						</p>
					</div>
				</section>

				{/* Filter Section */}
				<section className="filter-section">
					<div className="filter-container">
						<button
							onClick={() => setFilter("all")}
							className={`filter-btn ${filter === "all" ? "active" : ""}`}
						>
							All Projects
						</button>
						<button
							onClick={() => setFilter("interior")}
							className={`filter-btn ${filter === "interior" ? "active" : ""}`}
						>
							Interior
						</button>
						<button
							onClick={() => setFilter("exterior")}
							className={`filter-btn ${filter === "exterior" ? "active" : ""}`}
						>
							Exterior
						</button>
					</div>
					<div className="project-count">
						Showing {filteredItems.length} {filteredItems.length === 1 ? 'project' : 'projects'}
					</div>
				</section>

				{/* Gallery Grid */}
				<section className="gallery-section">
					<div className="gallery-grid">
						{filteredItems.map((item, index) => (
							<div
								key={item.id}
								className="gallery-item"
								onClick={() => openLightbox(item)}
								style={{ animationDelay: `${index * 0.05}s` }}
							>
								<div className="gallery-item-image">
									<img
										src={item.image}
										alt={item.title}
										loading="lazy"
									/>
									<div className="gallery-item-overlay">
										<h3 className="gallery-item-title">{item.title}</h3>
										<span className="gallery-item-category">
											{item.category.charAt(0).toUpperCase() + item.category.slice(1)}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Call to Action */}
				<section className="portfolio-cta">
					<div className="portfolio-cta-content">
						<h2 className="portfolio-cta-title">Ready to Transform Your Space?</h2>
						<p className="portfolio-cta-text">
							Let us bring the same level of craftsmanship to your home. Contact us today for a free consultation.
						</p>
						<div className="portfolio-cta-buttons">
							<a href={`tel:${siteData.phone}`} className="cta-btn primary">
								Call {siteData.phone}
							</a>
							<a href="/#contact" className="cta-btn secondary">
								Get a Quote
							</a>
						</div>
					</div>
				</section>

				{/* Lightbox */}
				{lightboxOpen && selectedImage && (
					<div className="lightbox" onClick={closeLightbox}>
						<button className="lightbox-close" onClick={closeLightbox}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M18 6L6 18M6 6l12 12" />
							</svg>
						</button>
						<button
							className="lightbox-nav prev"
							onClick={(e) => {
								e.stopPropagation()
								navigateLightbox('prev')
							}}
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M15 18l-6-6 6-6" />
							</svg>
						</button>
						<button
							className="lightbox-nav next"
							onClick={(e) => {
								e.stopPropagation()
								navigateLightbox('next')
							}}
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M9 18l6-6-6-6" />
							</svg>
						</button>
						<div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
							<img src={selectedImage.image} alt={selectedImage.title} />
							<div className="lightbox-info">
								<h3>{selectedImage.title}</h3>
								<span className="lightbox-category">
									{selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)} Painting
								</span>
							</div>
						</div>
					</div>
				)}
			</main>
		</>
	)
}
