import { siteData } from "@/data/siteData"
import Image from "next/image"

const Footer = () => {
	return (
		<footer className="px-6 py-10">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center justify-center">
					<div className="flex items-center gap-2 mb-2 lg:mb-0 lg:mr-4">
						<Image
							src={`/phone.svg`}
							width={25}
							height={25}
							alt="Phone"
						/>
						<a
							className="decoration-none"
							href={`tel:${siteData.phone}`}
							title={`Call us at ${siteData.phone}`}
						>
							{siteData.phone}
						</a>
					</div>
					<div className="border border-black dark:border-white h-[.1px] w-3/4 lg:w-40" />
					<Image
						src="/logos/logo-long-no-bg.png"
						width={180}
						height={60}
						alt="Sims Custom Homes Inc."
					/>
					<div className="border border-black dark:border-white h-[.1px] w-3/4 lg:w-40" />
					<div className="flex items-center gap-2">
						<Image
							src={`email.svg`}
							width={25}
							height={25}
							alt="Email"
						/>
						<a
							className="decoration-none"
							href={`mailto:${siteData.email}`}
							title={`Email us at ${siteData.email}`}
						>
							{siteData.email}
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
