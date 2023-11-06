import React from 'react'

import Image from 'next/image'
import Button from '@components/Button/page'
import Team from '../../../public/assets/images/Team.svg'

const AboutUs = () => {
	return (
		<div className="bg-white h-full float-left text-neutral-900 w-full flex flex-col lg:flex-row items-center justify-center">
			<div className="w-full lg:w-1/2 pr-[20px] flex items-center flex-col gap-y-[20px] text-center">
				<h1 className="text-5xl font-bold lg:self-start ">
					<span className="text-primary">About </span>Us
				</h1>

				<span className="text-justify">
					We are a team of dedicated individuals driven by a shared passion for innovation and excellence. Our journey began with a simple idea: to
					create solutions that make a difference. Today, we take pride in our commitment to pushing the boundaries of what&apos;s possible and
					delivering products and services that truly matter.
				</span>
				<span className="text-justify">
					As we invite you to learn more about us, youll discover the core values and principles that define our organization. From our relentless
					pursuit of quality to our unwavering dedication to customer satisfaction, our story is one of continuous growth, learning, and a genuine
					desire to make a positive impact in the world. Thank you for taking the time to get to know us better. We look forward to sharing our story,
					our vision, and our commitment to excellence with you.
				</span>
				<div className="w-full mt-[50px] flex justify-center lg:justify-start">
					<Button
						title="More Info"
						style=" w-fit justify-center text-white bg-gradient-to-r from-primary to-secondary font-bold w-[30%]"
						onHover="bg-gradient-to-r from-secondary to-primary"
						onClick={() => {
							// router.push('/demo')
						}}
					/>
				</div>
			</div>
			<div className="w-full lg:w-1/2 pl-[20px] flex items-center justify-end">
				<Image
					src={Team}
					alt="LSC logo"
					height="90%"
				/>
			</div>
		</div>
	)
}

export default AboutUs