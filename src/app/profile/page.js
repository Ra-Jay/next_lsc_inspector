'use client'

import Container from '@components/container'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import TextInput from '@components/textInput'
import Button from '@components/Button/page'
import ProfilePictureUpload from '@components/profilepictureUpload'
import Modal from '@components/Modal/page'
import { SvgIcon } from '@mui/material'
import { Edit } from '@mui/icons-material'
import { errorToast, successToast } from '@utils/toast'

import useUserStore from '../../useStore'
import useEditProfilePicture from '@hooks/useEditProfilePicture'
import useEdit from '@hooks/useEdit'
import useUpdatePassword from '@hooks/useUpdatePassword'

const Profile = () => {
	const { user } = useUserStore()
	const { uploadPicture } = useEditProfilePicture()
	const { editUser } = useEdit()
	const { isUpdating, updatePassword } = useUpdatePassword()

	const [username, setUsername] = useState(user?.user.username)
	const [errorUsername, setErrorUsername] = useState(null)
	const [email, setEmail] = useState(user?.user.email)
	const [errorEmail, setErrorEmail] = useState(null)
	const [password, setPassword] = useState('********')
	const [errorPassword, setErrorPassword] = useState(null)
	const [currentPassword, setCurrentPassword] = useState(null)
	const [currentErrorPassword, setCurrentErrorPassword] = useState(null)
	const [newPassword, setNewPassword] = useState('')
	const [newErrorPassword, setNewErrorPassword] = useState(null)
	const [confirmPass, setConfirmPass] = useState('')
	const [errorConfirmPass, setErrorConfirmPass] = useState(null)
	const [uploadedImage, setUploadedImage] = useState(null)
	const [loading, setLoading] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [error, setError] = useState(null)

	//temporary delete when final
	let userId
	let authorization
	if (user) {
		userId = user.user.id
		authorization = user.user.access_token
	}

	const updatePasswordCallbacks = {
		success: () => {
			successToast('Password Successfully Updated!')
			setIsModalOpen(!isModalOpen)
		},
		incorrectPassword: () => {
			errorToast('Incorrect Password!')
			setIsModalOpen(true)
		},
		notFound: () => {
			errorToast('Invalid Fields!')
			setIsModalOpen(true)
		},
		internalError: () => {
			errorToast('Internal Server ERROR!')
			setIsModalOpen(true)
		},
	}

	const editPassword = async () => {
		await updatePassword(
			userId,
			authorization,
			{
				old_password: currentPassword,
				new_password: newPassword,
			},
			updatePasswordCallbacks
		)
	}

	const handleSaveChanges = async () => {
		const userData = JSON.parse(localStorage.getItem('userAuth'))
		if (uploadedImage) {
			const formData = new FormData()
			formData.append('profile_image', uploadedImage)
			const response1 = await uploadPicture(userId, authorization, formData)
			userData.state.user.user.user_profile = response1
			userData.state.user.user.profile_image = response1.data.profile_image
			setLoading(true)
			if (response1.status === 201) {
				setLoading(false)
			} else {
				setLoading(false)
			}
		}

		const response = await editUser(userId, authorization, {
			username: username,
			email: email,
		})
		if (response.status === 200) {
			userData.state.user.user.username = username
			userData.state.user.user.email = email
			localStorage.setItem('userAuth', JSON.stringify(userData));
			successToast('Successfully updated your profile!')
			setLoading(false)
		} else {
			errorToast('Unsuccessful!')
			setLoading(false)
		}
	}

	const renderEditPassword = () => {
		return (
			<div className="w-full flex flex-col gap-6">
				{error && <span className="text-red-400">{error.overall}</span>}
				<div>
					<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-neutral-700">Current Password</label>
					<TextInput
						type="password"
						placeholder="Current Password"
						value={currentPassword}
						onChange={(password, errorPassword) => {
							setCurrentPassword(password)
							setCurrentErrorPassword(errorPassword)
						}}
						validation={{
							type: 'text_without_space',
							column: 'Password',
							size: 6,
							error: currentErrorPassword,
						}}
					/>
				</div>
				<div>
					<label
						htmlFor="new password"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-neutral-700"
					>
						New Password
					</label>
					<TextInput
						type="password"
						placeholder="New Password"
						value={newPassword}
						onChange={(password, errorPassword) => {
							// setError(null)
							setNewPassword(password)
							setNewErrorPassword(errorPassword)
						}}
						validation={{
							type: 'text_without_space',
							column: 'Password',
							size: 6,
							error: newErrorPassword,
						}}
					/>
				</div>
				<div>
					<label
						htmlFor="confirm-password"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-neutral-700"
					>
						Confirm password
					</label>
					<TextInput
						type="password"
						placeholder="Confirm Password"
						value={confirmPass}
						onChange={(confirmPass, errorConfirmPass) => {
							setError(null)
							setConfirmPass(confirmPass)
							setErrorConfirmPass(errorConfirmPass)
						}}
						validation={{
							type: 'text_without_space',
							column: 'Confirm Password',
							size: 6,
							error: errorConfirmPass,
						}}
					/>
				</div>
			</div>
		)
	}

	return (
		<Container>
			<div className="min-h-[100vh] relative float-left text-neutral-900 w-full justify-center p-[20px]">
				<h1 className="font-bold text-[25px]">Profile</h1>
				<div
					className="absolute flex items-center right-0 top-0 float-right text-gray-500 cursor-pointer hover:text-primary"
					onClick={() => setIsEditing(!isEditing)}
				>
					<span className="mr-1">Edit</span>
					<SvgIcon
						component={Edit}
						fontSize="small"
					/>
				</div>

				<ProfilePictureUpload
					editing={isEditing}
					setUploadedImage={setUploadedImage}
				/>

				<form
					className="space-y-4 md:space-y-6 flex flex-col"
					action="#"
				>
					<div>
						<div className="flex flex-row mb-8">
							<div className="w-1/2 mr-4">
								<label
									htmlFor="username"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Username
								</label>
								<TextInput
									type="username"
									placeholder="Username"
									value={username}
									disable={isEditing ? false : true}
									onChange={(username, errorUsername) => {
										setUsername(username)
										setErrorUsername(errorUsername)
									}}
									validation={{
										type: 'text_without_space',
										size: 2,
										column: 'Username',
										error: errorUsername,
									}}
								/>
							</div>
							<div className="w-1/2">
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Email Address
								</label>
								<TextInput
									type="email"
									placeholder="Email Address"
									value={email}
									disable={isEditing ? false : true}
									onChange={(email, errorEmail) => {
										setEmail(email)
										setErrorEmail(errorEmail)
									}}
									validation={{
										type: 'text_without_space',
										size: 2,
										column: 'Email',
										error: errorEmail,
									}}
								/>
							</div>
						</div>
						<div className="flex mb-4 mr-4">
							<div className="w-1/2 mr-4">
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Password
								</label>
								<TextInput
									type="password"
									placeholder="Password"
									value={password}
									disable={true}
									onChange={(password, errorPassword) => {
										setPassword(password)
										setErrorPassword(errorPassword)
									}}
									validation={{
										type: 'text_without_space',
										column: 'Password',
										size: 6,
										error: errorPassword,
									}}
								/>
							</div>
						</div>
						<div className="flex mb-24 mr-4">
							<div className="w-1/2 mr-4">
								<div className="flex items-center h-5 justify-end  mt-[-5px]">
									<span
										className="text-sm font-light text-gray-500 hover:underline cursor-pointer text-[12px] !pr-[-2px]"
										onClick={() => setIsModalOpen(!isModalOpen)}
									>
										Change Password
									</span>
								</div>
							</div>
						</div>
						{isEditing && (
							<div className="flex justify-center md:justify-end">
								<Button
									title="Save Changes"
									style=" w-fit bg-primary text-white hover:bg-primary h-[40px] justify-center"
									onClick={() => {
										setIsEditing(false)
										handleSaveChanges()
									}}
								/>
							</div>
						)}
					</div>
				</form>
			</div>
			{isModalOpen && (
				<Modal
					title="Change Password"
					onClose={() => {
						setIsModalOpen(!isModalOpen)
					}}
					content={renderEditPassword}
					style=" w-[30%]"
					footer={() => {
						return (
							<div className="w-full flex justify-end">
								<Button
									style={' bg-primary text-white ml-[20px]'}
									title="Save"
									onClick={() => {
										if (newPassword !== confirmPass) {
											setError({
												overall: `Password does not match!`,
											})
										} else {
											editPassword()
										}
									}}
								/>
							</div>
						)
					}}
				/>
			)}
		</Container>
	)
}

export default Profile
