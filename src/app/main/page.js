'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { saveAs } from 'file-saver'
import { SvgIcon } from '@mui/material'
import { Add, Check, Delete } from '@mui/icons-material'

import Container from '@components/container'
import Button from '@components/Button/page'
import TextInput from '@components/textInput'
import Modal from '@components/Modal/page'
import Toggle from '@components/Button/toggle'
import WebcamSkeleton from '@components/Skeleton/webcamSkeleton'
import Roboflow from '@components/Roboflow/roboflow'
import Skeleton from '@components/Skeleton/Skeleton'
import Helper from '@utils/string'
import { successToast, errorToast } from '@utils/toast'
import useUserStore from '../../useStore'
import useUpload from '@hooks/useUpload'
import useAnalyze from '@hooks/useAnalyze'
import useCreateWeight from '@hooks/useCreateWeight'
import useWeights from '@hooks/useWeights'
import useDeleteWeight from '@hooks/useDeleteWeight'

const Main = () => {
	const [isModalOpen, setIsModalOpen] = useState(true)
	const { user, isAuthenticated, activeWeight, setActiveWeight } = useUserStore()
	const { isUploading, uploadFile } = useUpload()
	const { analyzeFile, analyzing } = useAnalyze()
	const { isCreating, createWeight } = useCreateWeight(user?.user.access_token)
	const { isRetrieving, weights, fetchWeights } = useWeights(user?.user.access_token)
	const { isDeleting, deleteWeight } = useDeleteWeight()

	const [file, setFile] = useState(null)
	const [uploadedImage, setUploadedImage] = useState(null)
	const [analyzedImage, setAnalyzedImage] = useState(null)
	const [extension, setExtension] = useState(null)
	const [selectedIndex, setSelectedIndex] = useState(null)
	const [selectedModel, setSelectedModel] = useState(null)
	const [selected, setSelected] = useState(0)
	const [modelToBeDeleted, setModelToBeDeleted] = useState(null)
	const [toggleButton, setToggleButton] = useState(false)
	const [loading, setLoading] = useState(false)
	const [isModelModalOpen, setIsModelModalOpen] = useState(false)
	const [addNewModel, setAddNewModel] = useState(false)
	const [activeModel, setActiveModel] = useState(null)
	const [showModal, setShowModal] = useState(false);
	const [itemIdToDelete, setItemIdToDelete] = useState(null);

	const [projectName, setProjectName] = useState(null)
	const [apiKey, setApiKey] = useState(null)
	const [version, setVersion] = useState(1)
	const [workspace, setWorkspace] = useState(null)
	const [modelType, setModelType] = useState(null)
	const [modelPath, setModelPath] = useState(null)
	const [useCustomWeight, setUseCustomWeight] = useState(false)
	const [errors, setErrors] = useState(null)

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
			errorToast('No file selected!')
			setLoading(false)
		}
	}

	const analyzeCallbacks = {
		invalidFields: () => {
			errorToast('Invalid Fields!')
			setIsModalOpen(true)
			setErrors({
				overall: 'Invalid Fields',
			})
		},
		internalError: () => {
			errorToast('Invalid API key!')
			setIsModalOpen(true)
			setErrors({
				overall: 'This API key does not exist (or has been revoked).',
			})
		},
	}

	const handleAnalyze = async () => {
		setLoading(true)
		const response = await analyzeFile(
			{
				fileUrl: uploadedImage.url,
				project_name: activeWeight.project_name,
				api_key: activeWeight.api_key,
				version: activeWeight.version,
				weight_id: activeWeight.id || activeWeight.weight_id,
				callback: analyzeCallbacks,
			},
			user?.user.access_token
		)
		setAnalyzedImage(response.data)
		setLoading(false)
	}

	const weightsCallbacks = {
		success: () => {
			successToast('Successfully added a new model!')
			setIsModalOpen(!isModalOpen)
		},
		invalidFields: () => {
			errorToast('Invalid Fields!')
			setIsModalOpen(true)
			setErrors({
				overall: 'Invalid Fields',
			})
		},
		existed: () => {
			errorToast('Model already exists!')
			setIsModalOpen(true)
		},
		internalError: () => {
			errorToast('Invalid API key')
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
				workspace: selectedModel.workspace,
				model_type: selectedModel.model_type,
				model_path: null,
				type: 'pre-defined',
				callback: weightsCallbacks,
			})
			fetchWeights(weightsCallbacks)
			let weight_id = null;

			for (let weight of user.weights) {
					if (weight.project_name === selectedModel.project_name) {
							weight_id = weight.id;
							break;
					}
			}

			if (weight_id !== null) {
				setActiveWeight({
					project_name: selectedModel.project_name,
					api_key: selectedModel.api_key,
					version: selectedModel.version,
					workspace: selectedModel.workspace,
					model_type: selectedModel.model_type,
					weight_id: weight_id,
					model_path: null,
					type: 'pre-defined',
				})
			} else {
					errorToast('No models found!')
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
			fetchWeights(weightsCallbacks)
			if (activeWeight == null) {
				let weight_id = null;

				for (let weight of user.weights) {
						if (weight.project_name === selectedModel.project_name) {
								weight_id = weight.id;
								break;
						}
				}
				setActiveWeight({
					project_name: projectName,
					api_key: apiKey,
					version: version,
					workspace: workspace,
					model_type: modelType,
					model_path: modelPath,
					weight_id: weight_id,
					type: 'custom',
				})
			}
		}
	}

	const deleteItemCallbacks = {
		success: () => successToast('Successfully deleted!'),
		notFound: () => errorToast('Invalid Fields!'),
		internalError: () => errorToast('Internal Server ERROR!'),
	}

	const deleteItem = async (id) => {
		if (weights.length >= 2) {
			if (id) {
				setItemIdToDelete(id);
				setShowModal(true);
			}
		} else {
			errorToast('You need at least 1 model active!')
		}
	}

	const confirmDelete = async () => {
    await deleteWeight({ token: user?.user.access_token, id: itemIdToDelete, callback: deleteItemCallbacks })
    fetchWeights(deleteItemCallbacks);
    setShowModal(false);
	}
	const renderConfirmation = () => {
		return (
			<div>
				<h1 className="font-bold text-[20px]">Are you sure you want to delete this model?</h1>
					<span className="text-gray-400">Deleting this model will also delete the images associated with it.</span>
			</div>
		)
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
												selectedIndex === index ? `border-primary text-primary font-bold` : `border-gray-300 text-gray-500`
											} hover:border-primary hover:text-primary`}
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
						<h1 className="font-bold text-[20px]">
							Use your own model
							<Link
								href="http://localhost:3000/docs"
								rel="noopener noreferrer"
								target="_blank"
								className="text-sm font-normal ml-3 text-blue-400 hover:underline"
							>
								Need Help?
							</Link>
						</h1>
						<span className="text-gray-400">You can add your own custom dataset to be used in the AI model.</span>
						<div className="w-full py-4 flex flex-col gap-4">
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900">Project Name</label>
								<TextInput
									type="text"
									placeholder="project-name"
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
									placeholder="abCD1EfghjkLmNopqRs2"
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
									placeholder="workspace-name"
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
									placeholder="yolov5/yolov8"
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
									placeholder="/path/to/your/parent/folders/weights/best.pt"
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

	const renderModelModalContent = () => {
		return (
			<div className="flex flex-col">
				<div
					className="flex items-center w-fit self-end text-secondary cursor-pointer hover:underline mb-[20px]"
					onClick={() => setIsModalOpen(true)}
				>
					<SvgIcon
						component={Add}
						fontSize="small"
					/>
					<span onClick={() => setAddNewModel(!addNewModel)}>Add model</span>
				</div>
				{weights && activeWeight && (
					<div className="mb-6 px-[10px] py-[10px] font-bold bg-primary bg-opacity-20 border-y flex justify-between hover:bg-primary hover:bg-opacity-30 cursor-pointer">
						<div>
							<span>{activeWeight.project_name}</span>
							<span className="text-primary ml-3">(active model)</span>
						</div>
						<SvgIcon
							component={Delete}
							className="hover:text-red-500 cursor-pointer"
							onClick={() => deleteItem(activeWeight.id)}
						/>
					</div>
				)}
				<span className="font-bold text-gray-600">Available Models: </span>
				<ul className="mt-2 ">
					{!isRetrieving &&
						weights &&
						weights.length >= 1 &&
						weights.map(
							(item, index) =>
								item.project_name !== activeWeight?.project_name && (
									<div
										key={index}
										className="mb-6 px-[10px] py-[10px] font-bold bg-gray-300 bg-opacity-20 border-y flex justify-between hover:bg-gray-500 hover:bg-opacity-30 cursor-pointer"
									>
										<div>
											<span>{item.project_name}</span>
										</div>
										<div className="">
											<SvgIcon
												component={Check}
												className="hover:text-green-500 cursor-pointer mr-4"
												onClick={() => setActiveWeight(item)}
											/>
											<SvgIcon
												component={Delete}
												className="hover:text-red-500 cursor-pointer"
												onClick={() => deleteItem(item.id)}
											/>
										</div>
									</div>
								)
						)}
				</ul>
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

					<div className="float-right my-[20px] mr-[10px] hover:underline decoration-primary cursor-pointer">
						<span
							className="text-primary font-bold "
							onClick={() => setIsModelModalOpen(!isModelModalOpen)}
						>
							My models
						</span>
					</div>
					{user && user.weights.length == 0 && isAuthenticated && isModalOpen && (
						<Modal
							title="Setup your AI model"
							content={renderContent}
							style=" w-[40%]"
							footer={() => {
								return (
									<div className="w-full flex justify-end">
										<Button
											style={' bg-primary text-white ml-[20px]'}
											title="Continue"
											loading={isCreating}
											onClick={() => {
												if (selectedModel || (projectName && apiKey && modelPath && modelType && workspace)) {
													postWeight()
												} else if (selectedModel || projectName || apiKey) {
													errorToast('All fields are required!')
												} else {
													errorToast('You need to setup your model!')
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
										style=" bg-primary text-white hover:bg-primary"
										onClick={handleFileUpload}
										loading={isUploading}
									/>
								</form>
							</div>
							{uploadedImage && (
								<div className="w-full flex flex-col gap-y-10 mb-4 rounded shadow p-6 items-center md:flex-row md:items-start md:gap-x-10">
									<Image
										src={uploadedImage.url}
										alt="uploaded image"
										width={400}
										height={100}
										style={{ height: 'auto', maxHeight: '350px', maxWidth: '500px' }}
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
										style=" bg-primary text-white hover:bg-primary md:ml-auto"
										onClick={handleAnalyze}
										loading={analyzing}
									/>
								</div>
							)}
							{analyzedImage && (
								<div className="w-full flex flex-col gap-y-10 mb-4 rounded shadow p-6 items-center md:flex-row md:items-start md:gap-x-10">
									<Image
										src={analyzedImage.url}
										alt="analyzed image"
										width={400}
										height={100}
										style={{ height: 'auto', maxHeight: '350px', maxWidth: '500px' }}
									/>
									<div className="flex flex-col flex-shrink items-start font text-base">
										<div className="flex items-start mb-2">
											<p
												className="font-bold"
												style={{ width: '120px' }}
											>
												Classification:
											</p>
											<p className={analyzedImage.classification == 'Good' ? `text-primary font-bold` : `text-red-500 font-bold`}>
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
										style=" bg-primary text-white hover:bg-primary md:ml-auto"
										onClick={() => saveAs(analyzedImage.url, 'result.png')}
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
									style=" bg-primary text-white hover:bg-primary"
								/>
							</div>
							{toggleButton ? (
								<Roboflow
									apiKey={user?.weights[0].api_key || null}
									modelName={user?.weights[0].project_name || null}
									modelVersion={user?.weights[0].version || null}
								/>
							) : (
								<WebcamSkeleton />
							)}
						</div>
					)}
					{isModelModalOpen && (
						<Modal
							title="My Models"
							content={renderModelModalContent}
							style=" w-[40%]"
							onClose={() => {
								setIsModelModalOpen(!isModelModalOpen)
							}}
							// footer={() => {
							// 	return (
							// 		<div className="w-full flex justify-end">
							// 			<Button
							// 				style={' bg-primary text-white ml-[20px]'}
							// 				title="Continue"
							// 				loading={isCreating}
							// 				onClick={() => {
							// 					if (selectedModel || (projectName && apiKey && modelPath && modelType && workspace)) {
							// 						postWeight()
							// 					} else if (selectedModel || projectName || apiKey) {
							// 						errorToast('All fields are required!')
							// 					} else {
							// 						errorToast('You need to setup your model!')
							// 					}
							// 				}}
							// 			/>
							// 		</div>
							// 	)
							// }}
						/>
					)}
					{user && user.weights.length >= 1 && addNewModel && (
						<Modal
							title="Add new AI model"
							content={renderContent}
							style=" w-[40%]"
							onClose={() => {
								setAddNewModel(!addNewModel)
							}}
							footer={() => {
								return (
									<div className="w-full flex justify-end">
										<Button
											style={' bg-red-400 text-white'}
											title="Cancel"
											onClick={() => {
												setAddNewModel(!addNewModel)
											}}
										/>
										<Button
											style={' bg-primary text-white ml-[20px]'}
											title="Continue"
											loading={isCreating}
											onClick={() => {
												if (selectedModel || (projectName && apiKey && modelPath && modelType && workspace)) {
													postWeight()
													setAddNewModel(!addNewModel)
												} else if (selectedModel || projectName || apiKey) {
													errorToast('All fields are required!')
												} else {
													errorToast('You need to add new your model!')
												}
											}}
										/>
									</div>
								)
							}}
						/>
					)}
					{showModal && (
					<Modal
							title="Confirm Delete Model"
							content={renderConfirmation}
							style=" w-[40%]"
							onClose={() => {
								setShowModal(!showModal)
							}}
							footer={() => {
								return (
									<div className="w-full flex justify-end">
										<Button
											style={' bg-primary text-white ml-[20px]'}
											title="Cancel"
											onClick={() => {
												setShowModal(!showModal)
											}}
										/>
										<Button
											style={' bg-red-400 text-white'}
											title="Delete"
											loading={isCreating}
											onClick={confirmDelete}
										/>
									</div>
								)
							}}
						/>
					)}
				</div>
			</Container>
		</>
	)
}

export default Main
