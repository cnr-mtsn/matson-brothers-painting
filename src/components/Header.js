'use client'

import Link from "next/link"
import { siteData, links } from "../data/siteData"
import Image from "next/image"
import { useState, useEffect } from "react"

function Header() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])
	
	function toggleDrawer(e) {
		console.log("toggle drawer")
		setIsDrawerOpen(!isDrawerOpen)
		// Prevent body scroll when drawer is open
		document.body.style.overflow = !isDrawerOpen ? 'hidden' : 'unset'
	}

	const closeDrawer = () => {
		setIsDrawerOpen(false)
		document.body.style.overflow = 'unset'
	}

	return (
		<>
			<header className={`transition-all duration-300 ${scrolled ? 'header-scrolled' : ''}`}>
				<Link href="/" className="logo-link">
					<img
						src="/logos/new-logo-no-bg.png"
						alt={siteData.name}
						className="header-logo"
					/>
				</Link>

				{/* Desktop Navigation */}
				<nav className="desktop-nav">
					<Link href="/portfolio" className="header-link">
						Portfolio
					</Link>
					{links?.map(({ url, icon, label, title }, idx) => (
						<Link
							href={url}
							className="header-link"
							key={idx}
							title={title}
						>
							{icon && (
								<Image
									src={`${icon}.svg`}
									width={25}
									height={25}
									alt={icon}
								/>
							)}
							{label}
						</Link>
					))}
				</nav>

				{/* Mobile Menu Button */}
				<button
					type="button"
					className="mobile-menu-button"
					onClick={() => toggleDrawer()}
					aria-label="Toggle menu"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						className={`menu-icon ${isDrawerOpen ? 'open' : ''}`}
					>
						<line x1="3" y1="6" x2="21" y2="6"/>
						<line x1="3" y1="12" x2="21" y2="12"/>
						<line x1="3" y1="18" x2="21" y2="18"/>
					</svg>
				</button>
			</header>

			{/* Mobile Drawer Overlay */}
			{isDrawerOpen && (
				<div className="drawer-overlay" onClick={closeDrawer} />
			)}

			{/* Mobile Drawer */}
			<div className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}>
				<div className="drawer-header">
					<img
						src="/logos/new-logo-no-bg.png"
						alt={siteData.name}
						className="drawer-logo"
					/>
					<button
						type="button"
						className="drawer-close"
						onClick={closeDrawer}
						aria-label="Close menu"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>
				<nav className="drawer-nav">
					<Link href="/" className="drawer-link" onClick={closeDrawer}>
						Home
					</Link>
					<Link href="/portfolio" className="drawer-link" onClick={closeDrawer}>
						Portfolio
					</Link>
					{links?.map(({ url, icon, label, title }, idx) => (
						<Link
							href={url}
							className="drawer-link"
							key={idx}
							title={title}
							onClick={closeDrawer}
						>
							{icon && (
								<Image
									src={`${icon}.svg`}
									width={25}
									height={25}
									alt={icon}
								/>
							)}
							{label}
						</Link>
					))}
				</nav>
			</div>
		</>
	)
}

export default Header
