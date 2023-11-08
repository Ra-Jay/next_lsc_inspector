'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import useSignup from '@hooks/useRegister'

import Button from '@components/Button/page'
import TextInput from '@components/textInput'
import Validator from '@utils/validator'
import { SvgIcon } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import Google from '../../../public/assets/images/google.png'
import Logo from '../../../public/assets/images/white-logo.svg'

const Signup = () => {
	const router = useRouter()
	const { isSigningUp, signupUser } = useSignup()
	const [username, setUsername] = useState('')
	const [errorUsername, setErrorUsername] = useState(null)
	const [email, setEmail] = useState('')
	const [errorEmail, setErrorEmail] = useState(null)
	const [password, setPassword] = useState('')
	const [errorPassword, setErrorPassword] = useState(null)
	const [confirmPass, setConfirmPass] = useState('')
	const [errorConfirmPass, setErrorConfirmPass] = useState(null)
	const [error, setError] = useState(null)

	const registerUserCallbacks = {
		invalidFields: () =>
			setError({
				overall: 'Invalid email address and/or password.',
			}),
		emailExists: () =>
			setError({
				overall: 'Email already existed',
			}),
		internalError: () =>
			setError({
				overall: 'Oops, something went wrong.',
			}),
	}

	const onSubmit = async () => {
		await signupUser({
			username: username,
			email: email,
			password: password,
			callbacks: registerUserCallbacks,
		})
		router.push('/login')
	}

	const validation = () => {
		if (!Validator.checkEmail(email)) {
			setError({
				emailError: 'Invalid email address',
			})
		} else setError(null)
	}

	return (
		<div className="bg-gradient-to-r from-primary to-secondary w-full h-[100vh] float-left px-5 md:px-[200px]">
			<div className=" h-[100vh] float-left text-neutral-900 w-full flex flex-col gap-10 items-center justify-center">
				<SvgIcon
					component={ArrowBack}
					className="absolute left-6 top-6 w-20 h-auto text-white cursor-pointer"
					fontSize="large"
					onClick={() => router.back()}
				/>
				<Image
					src={Logo}
					alt="logo"
					className="w-[200px] md:w-[300px] lg:w-[400px] h-auto"
				/>
				<div className="w-full bg-white rounded-xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-neutral-700">Create an account</h1>

						{error && <span className="text-red-400 py-8">{error.overall}</span>}

						<form
							className="space-y-4 md:space-y-6"
							action="#"
						>
							<div>
								<label
									htmlFor="username"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-neutral-700"
								>
									Your username
								</label>
								<TextInput
									type="text"
									placeholder="Username"
									value={username}
									name="username"
									id="email"
									onChange={(username, errorUsername) => {
										setError(null)
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
							<div>
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-neutral-700"
								>
									Your email
								</label>
								<TextInput
									type="email"
									placeholder="Email Address"
									value={email}
									onChange={(email, errorEmail) => {
										setError(null)
										validation()
										setEmail(email)
										setErrorEmail(errorEmail)
									}}
									validation={{
										type: 'text_without_space',
										size: 2,
										column: 'Email',
										error: error?.emailError || errorEmail,
									}}
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-neutral-700"
								>
									Password
								</label>
								<TextInput
									type="password"
									placeholder="Password"
									value={password}
									onChange={(password, errorPassword) => {
										setError(null)
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
							<Button
								title="Register"
								style=" w-full bg-primary text-white hover:bg-primary h-[40px]"
								loading={isSigningUp}
								onClick={() => {
									if (!error) {
										if (email !== '' && password !== '' && username !== '' && confirmPass !== '') {
											if (password !== confirmPass) {
												setError({
													overall: `Password does not match!`,
												})
											} else onSubmit()
										} else {
											setError({
												overall: `Don't leave any field empty!`,
											})
										}
									}
								}}
							/>
							<Button
								title="Login with Google"
								style=" w-full bg-primary border border-gray-300 hover:bg-gray-50 h-[39px] bg-white text-gray-500"
								onClick={() => {}}
							/>
							{/* <Image
									src={Google}
									alt="Google Logo"
									width={20}
									className=""
								/> */}
							<p className="text-sm font-light text-gray-500 dark:text-gray-400 pt-[20px]">
								Already have an account?{' '}
								<Link
									href="login"
									className="font-medium text-primary-600 hover:underline dark:text-primary-500"
								>
									Login here
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Signup
