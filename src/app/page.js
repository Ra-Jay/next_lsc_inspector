'use client'
import Banner from '@components/Landing/banner'
import AboutUs from '@components/Landing/aboutUs'
import Features from '@components/Landing/features'

export default function Home() {
	return (
		<main className="flex bg-white min-h-screen flex-col items-center justify-between">
			<div className="w-full h-full float-left px-[30px] lg:px-[200px]">
				<div className='flex flex-col h-full gap-y-5 mb-2'>
					<Banner />
					<Features />
					<AboutUs />
				</div>
			</div>
		</main>
	)
}