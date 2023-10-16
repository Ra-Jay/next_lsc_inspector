'use client'

import React, { useState } from 'react'

import Container from '@components/container'
import Button from '@components/Button/page'
import TextInput from '@components/textInput'
import Modal from '@components/Modal/page'
import Toggle from '@components/Button/toggle'
import WebcamSkeleton from '@components/Skeleton/webcamSkeleton'
import Roboflow from '@components/Roboflow/roboflow'
import Skeleton from '@components/Skeleton/Skeleton'
import Helper from '@utils/string'

import { toast } from 'react-toastify'

import useUserStore from '../../useStore'
import useUpload from '@hooks/useUpload'
import useAnalyze from '@hooks/useAnalyze'
import useDownload from '@hooks/useDownloadFile'
import useCreateWeight from '@hooks/useCreateWeight'

const Main = () => {
	const [isModalOpen, setIsModalOpen] = useState(true)
	const { user, isAuthenticated } = useUserStore()
	const { uploadFile } = useUpload()
	const { analyzeFile } = useAnalyze()
	const { downloadFile } = useDownload()
	const { isCreating, createWeight } = useCreateWeight(user?.user.access_token)

	const [file, setFile] = useState(null)
	const [uploadedImage, setUploadedImage] = useState(null)
	const [analyzedImage, setAnalyzedImage] = useState(null)
	const [extension, setExtension] = useState(null)
	const [selectedIndex, setSelectedIndex] = useState(null)
	const [selectedModel, setSelectedModel] = useState(null)
	const [selected, setSelected] = useState(0)
	const [toggleButton, setToggleButton] = useState(false)
	const [loading, setLoading] = useState(false)

	const [projectName, setProjectName] = useState(null)
	const [apiKey, setApiKey] = useState(null)
	const [version, setVersion] = useState(1)
	const [workspace, setWorkspace] = useState(null)
	const [modelType, setModelType] = useState(null)
	const [modelPath, setModelPath] = useState(null)
	const [useCustomWeight, setUseCustomWeight] = useState(false)
	const [errors, setErrors] = useState(null)
	const ls = localStorage.getItem('userAuth')
	const session = JSON.parse(ls)
	console.log(user.access_token)

	const handleFileUpload = async () => {
		if (file) {
			setLoading(true)
			const formData = new FormData()
			formData.append('file', file)

			const response = await uploadFile({
				body: formData,
			})
			if (response) {
				setUploadedImage(response.data)
				setExtension(response.data.name.split('.').pop())
				setLoading(false)
			} else {
				setLoading(false)
			}
		} else {
			console.error('No file selected')
		}
	}

	const handleAnalyze = async () => {
		console.log(session?.state)
		console.log(user?.user)
		if (uploadedImage) {
			try {
				setLoading(true)
				const response = await analyzeFile(
					{
						fileUrl: uploadedImage.url,
						project_name: user?.weights[0].project_name || null,
						api_key: user?.weights[0].api_key || null,
						version: user?.weights[0].version || null,
					},
					user?.user.access_token
				)

				if (response.status === 201) {
					console.log('Image analyzed successfully')
					setAnalyzedImage(response.data)
					setLoading(false)
				} else {
					console.error('Image analyze unsuccessful')
					setLoading(false)
				}
			} catch (error) {
				setLoading(false)
				console.error('Error analyzing file:', error.message)
			}
		} else {
			console.error('No file selected')
		}
	}

	const weightsCallbacks = {
		success: () => {
			toast.success('Successfully added a new model!', {
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'light',
			})
			setIsModalOpen(!isModalOpen)
		},
		invalidFields: () => {
			toast.error('Invalid fields!', {
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'colored',
			})
			setIsModalOpen(true)
			setErrors({
				overall: 'Invalid Fields',
			})
		},
		existed: () => {
			toast.error('Weight already existed!', {
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'colored',
			})
			setIsModalOpen(true)
		},
		internalError: () => {
			toast.error('Internal Server ERROR', {
				position: 'top-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'colored',
			})
			setIsModalOpen(true)
			setErrors({
				overall: 'This API key does not exist (or has been revoked).',
			})
		},
	}

	const postWeight = async () => {
		if (selectedModel) {
			await createWeight({
				project_name: selectedModel.project_name,
				api_key: selectedModel.api_key,
				version: selectedModel.version,
				workspace: null,
				model_type: null,
				model_path: null,
				type: 'pre-defined',
				callback: weightsCallbacks,
			})
			session.state.user.user = {
				...session.state.user.user,
				project_name: selectedModel.project_name,
				api_key: selectedModel.api_key,
				version: selectedModel.version,
			}
		} else {
			await createWeight({
				project_name: projectName,
				api_key: apiKey,
				version: version,
				workspace: workspace,
				model_type: modelType,
				model_path: modelPath,
				type: 'custom',
				callback: weightsCallbacks,
			})
			session.state.user.user = {
				...session.state.user.user,
				project_name: projectName,
				api_key: apiKey,
				version: version,
			}
		}
		const updatedData = JSON.stringify(session)
		localStorage.setItem('userAuth', updatedData)
	}

	const handleExport = () => {
		// downloadFile(user?.user.access_token, { id: analyzedImage.id, destination: 'C:/Users/Kerr/Downloads/downloaded_image.png' })
	}

	const renderContent = () => {
		return (
			<div>
				<div className="flex flex-col mb-[20px]">
					<div className={`w-full flex ${errors ? `justify-between` : `justify-end`} mb-[20px] `}>
						{errors && <span className="text-red-400">{errors.overall}</span>}
						<Toggle
							title="Use custom weights"
							onClick={() => setUseCustomWeight(!useCustomWeight)}
						/>
					</div>
					{!useCustomWeight && (
						<div>
							<h1 className="font-bold text-[20px]">Model</h1>
							<span className="text-gray-400">Select from any from our pre-defined model you want to use.</span>
							<ul className="flex py-[20px] gap-3">
								{Helper &&
									Helper.predefinedWeights.map((item, index) => (
										<li
											key={index}
											className={`w-fit px-[10px] py-[5px] cursor-pointer rounded-md border ${
												selectedIndex === index ? `border-green-400 text-green-500 font-bold` : `border-gray-300 text-gray-500`
											} hover:border-green-300 hover:text-green-500`}
											onClick={() => {
												setSelectedModel(item)
												setSelectedIndex(index)
											}}
										>
											<span className="">{item.title}</span>
										</li>
									))}
							</ul>
						</div>
					)}
				</div>
				{useCustomWeight && (
					<div className="flex flex-col">
						<h1 className="font-bold text-[20px]">Use your own model</h1>
						<span className="text-gray-400">You can add your own custom dataset to be used in the AI model.</span>
						<div className="w-full py-4 flex flex-col gap-4">
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">Project Name</label>
								<TextInput
									type="text"
									placeholder="lsc-inspector"
									value={projectName}
									onChange={(projectName) => {
										setErrors(null)
										setProjectName(projectName)
									}}
									validation={{
										type: 'text_without_space',
										size: 11,
										column: 'projectName',
										// error: errors,
									}}
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">Api Key</label>
								<TextInput
									type="text"
									placeholder="lnVB1Fnjsd5EdDdsnMg7"
									value={apiKey}
									onChange={(apiKey) => {
										setErrors(null)
										setApiKey(apiKey)
									}}
									validation={{
										type: 'text_without_space',
										size: 11,
										column: 'apiKey',
										// error: errors,
									}}
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">Version</label>
								<TextInput
									type="text"
									placeholder="1"
									value={version}
									onChange={(version) => {
										setErrors(null)
										setVersion(version)
									}}
									validation={{
										type: 'text_without_space',
										size: 11,
										column: 'version',
										// error: errors,
									}}
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">Workspace</label>
								<TextInput
									type="text"
									placeholder="intellysis"
									value={workspace}
									onChange={(workspace) => {
										setErrors(null)
										setWorkspace(workspace)
									}}
									validation={{
										type: 'text_without_space',
										size: 11,
										column: 'workspace',
										// error: errors,
									}}
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">Model Type</label>
								<TextInput
									type="text"
									placeholder="yolov5"
									value={modelType}
									onChange={(modelType) => {
										setErrors(null)
										setModelType(modelType)
									}}
									validation={{
										type: 'text_without_space',
										size: 11,
										column: 'modelType',
										// error: errors,
									}}
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">Model Path</label>

								<TextInput
									type="text"
									placeholder="path in your local directory"
									value={modelPath}
									onChange={(modelPath) => {
										setErrors(null)
										setModelPath(modelPath)
									}}
									validation={{
										type: 'text_without_space',
										size: 11,
										column: 'modelPath',
										// error: errors,
									}}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		)
	}

	return (
		<>
			<Container>
				<div className="min-h-[100vh] float-left text-neutral-900 w-full justify-center p-[20px]">
					<h1 className="font-bold text-[25px]">Prediction</h1>
					<ul className="flex flex-wrap -mb-px  border-b border-gray-200">
						<li className="mr-2">
							<div>
								<a
									className={`inline-block p-4 cursor-pointer ${
										selected === 0
											? 'text-green-600 border-b-2 font-bold border-green-600 rounded-t-lg active'
											: 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600  hover:border-gray-300'
									}`}
									onClick={() => setSelected(0)}
								>
									Upload Image
								</a>
								<a
									className={`inline-block p-4 cursor-pointer ${
										selected === 1
											? 'text-green-600 border-b-2 font-bold border-green-600 rounded-t-lg active'
											: 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600  hover:border-gray-300'
									}`}
									onClick={() => setSelected(1)}
								>
									External Webcam
								</a>
							</div>
						</li>
					</ul>
					{user && user.weights.length == 0 && isAuthenticated && isModalOpen && (
						<Modal
							title="Setup your AI model"
							content={renderContent}
							style=" w-[40%]"
							footer={() => {
								return (
									<div className="w-full flex justify-end">
										<Button
											style={' bg-green-400 text-white ml-[20px]'}
											title="Continue"
											loading={isCreating}
											onClick={() => {
												if (selectedModel || (projectName && apiKey && modelPath && modelType && workspace)) {
													postWeight()
												} else if (selectedModel || projectName || apiKey) {
													toast.error('All fields are required!', {
														position: 'top-center',
														autoClose: 5000,
														hideProgressBar: false,
														closeOnClick: true,
														pauseOnHover: true,
														draggable: true,
														progress: undefined,
														theme: 'colored',
													})
												} else {
													toast.error('You need to setup your model!', {
														position: 'top-center',
														autoClose: 5000,
														hideProgressBar: false,
														closeOnClick: true,
														pauseOnHover: true,
														draggable: true,
														progress: undefined,
														theme: 'colored',
													})
												}
											}}
										/>
									</div>
								)
							}}
						/>
					)}
					{selected === 0 ? (
						<>
							<div className="w-full flex flex-col gap-x-1 items-left justify-between mb-4 h-48 rounded shadow p-6 mt-10">
								<h1 className="text-3xl font-bold">Upload your image</h1>
								<form
									id="fileUploadForm"
									method="POST"
									encType="multipart/form-data"
									className="flex justify-between"
								>
									<input
										type="file"
										name="file"
										accept=".txt, .pdf, .png, .jpg, .jpeg, .gif"
										onChange={({ target }) => {
											setUploadedImage(null)
											setAnalyzedImage(null)
											setFile(target.files[0])
										}}
									/>
									<Button
										title="Upload"
										style=" bg-green-400 text-white hover:bg-green-500"
										onClick={handleFileUpload}
									/>
								</form>
							</div>
							{uploadedImage && (
								<div className="w-full flex flex-col gap-y-10 mb-4 rounded shadow p-6 items-center md:flex-row md:items-start md:gap-x-10">
									<img
										className="flex-shrink w-1/3 h-1/2 object-cover"
										src={uploadedImage.url}
										alt="Uploaded"
									/>
									<div className="flex flex-col flex-shrink items-start font text-base">
										<div className="flex items-start mb-2">
											<p
												className="font-bold mr-5"
												style={{ width: '100px' }}
											>
												Filename:
											</p>
											<p className="break-words max-w-[400px] xl:max-w-[23rem] md:max-w-[10rem]">{uploadedImage.name}</p>
										</div>
										<div className="flex items-center mb-2">
											<p
												className="font-bold mr-5"
												style={{ width: '100px' }}
											>
												Dimensions:
											</p>
											<p>{uploadedImage.dimensions}</p>
										</div>
										<div className="flex items-center mb-2">
											<p
												className="font-bold mr-5"
												style={{ width: '100px' }}
											>
												Size:
											</p>
											<p>{uploadedImage.size}</p>
										</div>
										<div className="flex items-center">
											<p
												className="font-bold mr-5"
												style={{ width: '100px' }}
											>
												Extension:
											</p>
											<p>{extension}</p>
										</div>
									</div>
									<Button
										title="Analyze"
										style=" bg-green-400 text-white hover:bg-green-500 md:ml-auto"
										onClick={handleAnalyze}
									/>
								</div>
							)}
							{analyzedImage && (
								<div className="w-full flex flex-col gap-y-10 mb-4 rounded shadow p-6 items-center md:flex-row md:items-start md:gap-x-10">
									<img
										className="flex-shrink-0 w-1/3 h-1/2 object-cover"
										src={analyzedImage.url}
										alt="Uploaded"
									/>
									<div className="flex flex-col flex-shrink items-start font text-base">
										<div className="flex items-start mb-2">
											<p
												className="font-bold"
												style={{ width: '120px' }}
											>
												Classification:
											</p>
											<p className={analyzedImage.classification == 'Good' ? `text-green-400 font-bold` : `text-red-500 font-bold`}>
												{analyzedImage.classification}
											</p>
										</div>
										<div className="flex items-center mb-2 ">
											<p
												className="font-bold mr-5"
												style={{ width: '100px' }}
											>
												Accuracy:
											</p>
											<p>{analyzedImage.accuracy}</p>
										</div>
										<div className="flex items-center mb-2">
											<p
												className="font-bold mr-5"
												style={{ width: '100px' }}
											>
												Error Rate:
											</p>
											<p>{analyzedImage.error_rate} </p>
										</div>
										<div className="flex items-start">
											<p className="font-bold mr-20">Path:</p>
											<p className="break-words max-w-[400px] xl:max-w-[23rem] md:max-w-[10rem]">{analyzedImage.url}</p>
										</div>
									</div>
									<Button
										title="Export"
										style=" bg-green-400 text-white hover:bg-green-500 md:ml-auto"
										onClick={handleExport}
									/>
								</div>
							)}
							{loading && (
								<div className="w-full flex flex-col gap-x-1 items-left justify-between mb-4 h-fit rounded shadow p-6 mt-10">
									<Skeleton title={'Loading...'} />
								</div>
							)}
						</>
					) : (
						<div className="w-full h-full mt-10 flex flex-col items-center gap-[20px]">
							<div className="w-full flex justify-end">
								<Button
									title={!toggleButton ? 'Open Webcam' : 'Close Webcam'}
									onClick={() => setToggleButton(!toggleButton)}
									style=" bg-green-400 text-white hover:bg-green-500"
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
				</div>
			</Container>
		</>
	)
}

export default Main
