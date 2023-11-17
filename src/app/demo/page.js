'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Modal from '@components/Modal/page'
import Button from '@components/Button/page'
import Roboflow from '@components/Roboflow/roboflow'
import Container from '@components/container'
import WebcamSkeleton from '@components/Skeleton/webcamSkeleton'
import useUpload from '@hooks/useUpload'
import useAnalyze from '@hooks/useDemoAnalyze'
import ImageSkeleton from '@components/Skeleton/imageSkeleton'

const Demo = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [toggleButton, setToggleButton] = useState(false)
	const [selected, setSelected] = useState(0)
	const [selectedFile, setSelectedFile] = useState(null)
	const [uploadedFile, setUploadedFile] = useState(null)
	const [file, setFile] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { isUploading, uploadFile } = useUpload()
	const { isAnalyzing, analyzeFile } = useAnalyze()

	const handleFileChange = (event) => {
		setFile(null)
		setUploadedFile(null)
		const file = event.target.files[0]
		setSelectedFile(file)
	}

	const analyzeImage = async () => {
		setLoading(true)
		const response = await analyzeFile({ url: uploadedFile.url })
		if (response) {
			setFile(response.data)
			setLoading(false)
		} else {
			setLoading(false)
		}
	}

	const uploadImage = async () => {
		setLoading(true)
		if (selectedFile) {
			const formData = new FormData()
			formData.append('file', selectedFile)
			const response = await uploadFile({
				body: formData,
			})

			if (response) {
				setUploadedFile(response.data)
				setLoading(false)
			} else {
				setLoading(false)
			}
		} else {
			console.error('No file selected')
		}
	}

	const renderContent = () => {
		return (
			<div className="flex flex-col gap-[10px]">
				<span>You need to log in to export this image.</span>
				<span
					className=" text-md font-bold text-secondary cursor-pointer hover:underline"
					onClick={() => {
						router.push('/login')
					}}
				>
					Login in here {`>`}
				</span>
			</div>
		)
	}

	return (
		<div className="bg-white w-full h-fit float-left lg:px-[200px] md:px-[80px] sm:px-[20px] mb-[200px]">
			<Container style=" text-neutral-900 mt-[100px]">
				<ul className="flex flex-wrap -mb-px  border-b border-gray-200">
					<li className="mr-2">
						<div>
							<a
								className={`inline-block p-4 cursor-pointer ${
									selected === 0
										? 'text-primary border-b-2 font-bold border-primary rounded-t-lg active'
										: 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600  hover:border-gray-300'
								}`}
								onClick={() => setSelected(0)}
							>
								Upload Image
							</a>
							<a
								className={`inline-block p-4 cursor-pointer ${
									selected === 1
										? 'text-primary border-b-2 font-bold border-primary rounded-t-lg active'
										: 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600  hover:border-gray-300'
								}`}
								onClick={() => setSelected(1)}
							>
								External Webcam
							</a>
						</div>
					</li>
				</ul>
				{selected === 0 ? (
					<>
						<div className="w-full flex flex-col gap-x-1 items-left justify-between mb-4 h-48 rounded shadow p-6 mt-10">
							<h1 className="text-3xl font-bold">Upload your image</h1>
							<form
								method="POST"
								encType="multipart/form-data"
								className="flex justify-between"
							>
								<input
									type="file"
									name="file"
									accept=".txt, .pdf, .png, .jpg, .jpeg"
									onChange={handleFileChange}
								/>
								<Button
									title="Upload"
									style=" bg-primary bg-opacity-80 text-white hover:bg-primary hover:bg-opacity-100"
									onClick={uploadImage}
									loading={isUploading}
								/>
							</form>
						</div>

						{uploadedFile && (
							<div className="w-full h-fit flex flex-col gap-x-1 items-left justify-between mb-4 min-h-48 rounded shadow p-6 mt-10 gap-[20px]">
								<h1 className="text-xl font-bold">Analyze Image</h1>

								<div className="flex flex-col relative items-center gap-[20px]">
									<Image
										src={uploadedFile?.url}
										alt="upload image"
										width={500} // Set a default width (in pixels)
										height={100} // Set a default height (in pixels)
										layout="responsive" // Set layout to responsive
										style={{ maxHeight: '350px', maxWidth: '600px' }}
									/>
									<Button
										title="Analyze"
										style=" bg-primary bg-opacity-80 text-white hover:bg-primary hover:bg-opacity-100 w-[250px] md:w-[500px]"
										onClick={analyzeImage}
										loading={isAnalyzing}
									/>
								</div>
							</div>
						)}

						{loading && (
							<div className="w-full md:w-full flex flex-col gap-x-1 items-left justify-between mb-4 h-fit rounded shadow p-6 mt-10">
								<ImageSkeleton title={'analyzing image...'} />
							</div>
						)}
						{file && (
							<div className="w-full h-fit flex relative flex-col gap-x-1 items-left justify-between mb-4 min-h-48 rounded shadow p-6 mt-10 gap-[20px]">
								<h1 className="text-xl font-bold">Results: </h1>
								<Button
									title="Export"
									style=" bg-primary bg-opacity-80 text-white hover:bg-primary hover:bg-opacity-100 absolute right-6 top-6"
									onClick={() => {
										setIsModalOpen(!isModalOpen)
									}}
								/>

								<div className="flex relative items-center gap-[20px] mt-5">
									<Image
										src={file?.url}
										alt="result image"
										width={500}
										height={100}
										style={{ height: 'auto', maxHeight: '350px', maxWidth: '600px' }}
									/>
									<div className="w-fit overflow-hidden">
										<div>
											<b>Classification: </b>

											<span className={file.classification == 'Good' ? `text-primary font-bold` : `text-red-500 font-bold`}>
												{file.classification}
											</span>
										</div>
										<div>
											<b>Accuracy: </b>
											<span>{file.accuracy}</span>
										</div>
										<div>
											<b>Error Rate: </b>
											<span>{file.error_rate}</span>
										</div>
										<div className="flex gap-2">
											<b>Url: </b>
											<Link
												href={file.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-secondary hover:underline"
											>
												{file.url}
											</Link>
										</div>
									</div>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="w-full h-full mt-10 flex flex-col items-center gap-[20px]">
						<div className="w-full flex justify-end">
							<Button
								title={!toggleButton ? 'Open Webcam' : 'Close Webcam'}
								onClick={() => setToggleButton(!toggleButton)}
								style=" bg-primary bg-opacity-80 text-white hover:bg-primary hover:bg-opacity-100"
							/>
						</div>
						{toggleButton ? (
							<Roboflow
								modelName="body parts"
								modelVersion="1"
							/>
						) : (
							<WebcamSkeleton />
						)}
					</div>
				)}
				{isModalOpen && (
					<Modal
						title="Export File"
						onClose={() => {
							setIsModalOpen(!isModalOpen)
						}}
						content={renderContent}
						footer={() => {
							return (
								<div className="w-full flex justify-end">
									<Button
										style={' bg-primary text-white ml-[20px]'}
										title="Close"
										onClick={() => {
											setIsModalOpen(!isModalOpen)
										}}
									/>
								</div>
							)
						}}
					/>
				)}
			</Container>
		</div>
	)
}

export default Demo
