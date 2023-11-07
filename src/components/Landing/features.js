import React from 'react'
import { SvgIcon } from '@mui/material'
import { Videocam, Photo, SmartToy } from '@mui/icons-material'

const Features = () => {
	return (
		<div className="bg-white h-full md:h-[100vh]  float-left text-neutral-900 w-full flex items-center justify-center">
			<div className="w-full flex items-center flex-col gap-y-[80px]">
				<div className="flex flex-col items-center justify-center">
					<h1 className="text-5xl font-bold text-primary">Features</h1>
					<span className="w-full lg:w-[45%] justify-center mt-[10px] md:text-center">
						With these advanced features, our Laser Solder Quality Assessment Web Application provides a comprehensive and versatile solution for
						users in the electronics and manufacturing industries. Whether you&apos;re seeking automated quality control or wish to apply your own
						expertise through custom models, our application has you covered.
					</span>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3">
					<div className="flex items-center justify-start flex-col lg:border-r-[1px] border-neutral-700 gap-y-[30px] p-[40px]">
						<div className="flex items-center gap-[20px]">
							<SvgIcon
								component={Photo}
								fontSize="large"
								className="text-primary"
							/>
							<h1 className="text-[20px] font-bold">Image Upload</h1>
						</div>
						<span className="justify-between lg:text-center">
							Users can easily upload images of laser solder joints, and our web application will employ a sophisticated algorithm to detect and
							evaluate the quality of the solder joints. This feature enables quick and accurate assessment, helping users identify issues and
							anomalies in their soldering work.
						</span>
					</div>
					<div className="flex items-center justify-start flex-col lg:border-r-[1px] border-neutral-700 gap-y-[30px] p-[40px]">
						<div className="flex items-center gap-[20px]">
							<SvgIcon
								component={Videocam}
								fontSize="large"
								className="text-primary"
							/>
							<h1 className="text-[20px] font-bold">External Camera</h1>
						</div>
						<span className="justify-between lg:text-center">
							Users have the option to connect external cameras to the web application. This allows for real-time inspection of microcomponents and
							laser solder joints. The application can classify the quality of laser solder on these intricate components, making it ideal for quality
							control and manufacturing processes.
						</span>
					</div>
					<div className="flex items-center justify-start flex-col gap-y-[30px] p-[40px]">
						<div className="flex items-center gap-[20px]">
							<SvgIcon
								component={SmartToy}
								fontSize="large"
								className="text-primary"
							/>
							<h1 className="text-[20px] font-bold">Custom Model</h1>
						</div>
						<span className="justify-between lg:text-center ">
							Users can take customization to the next level by uploading their custom machine learning models. These models can be seamlessly
							integrated into our algorithm, allowing users to tailor the quality assessment process to their specific needs. Whether it&apos;s
							fine-tuning the algorithm for unique components or incorporating proprietary quality criteria, this feature empowers users to make the
							application truly their own.
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Features