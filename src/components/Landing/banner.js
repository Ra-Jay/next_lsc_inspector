import Image from 'next/image'
import BannerImage from '../../../public/assets/images/banner.svg'
import Button from '@components/Button/page'

const Banner = () => {
	return (
		<div className="bg-white h-[100vh] float-left text-neutral-900 w-full flex items-center justify-center">
			<div className="w-1/2 pr-[20px] flex items-center justify-center flex-col gap-y-[20px]">
				<div className="flex bg-gray-200 pl-[10px] pr-[3px] rounded-2xl items-center self-start text-neutral-700">
					<span>Powered by</span>
					<div className="bg-green-500 ml-[10px] my-[3px] px-[10px] rounded-2xl font-bold text-neutral-700">
						<span>YOLO V8</span>
					</div>
				</div>
				<h1 className="text-5xl font-bold">
					<span className="text-green-500">Laser Soldering Qualitative</span> Inspector
				</h1>

				<span className="text-justify">
					Unlock the power of AI with our cutting-edge image detection technology. Simply upload your image, and let AI do the rest. Get instant
					insights, make informed decisions, and experience a whole new level of convenience.
				</span>
				<span className="text-justify">
					Join us on this exciting journey and see how AI can elevate your object-detection game. Discover a smarter way to interact with images
					today!
				</span>
				<div className="w-full mt-[50px]">
					<Button
						title="Try it now for FREE!"
						style=" justify-center text-white w-full bg-gradient-to-r from-green-500 to-blue-300 font-bold"
						onHover="bg-gradient-to-r from-blue-300 to-green-500"
						onClick={() => {
							console.log('hello')
						}}
					/>
					<span className="text-xs text-neutral-400">Get started today and try it now with our pre-trained model.</span>
				</div>
			</div>

			<div className="w-1/2 pl-[20px] flex items-center justify-end">
				<Image
					src={BannerImage}
					alt="LSC logo"
					height="90%"
				/>
			</div>
		</div>
	)
}

export default Banner
