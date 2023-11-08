'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import useLogin from '@hooks/useLogin'

import Button from '@components/Button/page'
import TextInput from '@components/textInput'
import { SvgIcon } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import Google from '../../../public/assets/images/google.png'
import Logo from '../../../public/assets/images/white-logo.svg'

const Login = () => {
	const router = useRouter()
	const { isLoggingIn, loginUser } = useLogin()
	const [email, setEmail] = useState('')
	const [errorEmail, setErrorEmail] = useState(null)
	const [password, setPassword] = useState('')
	const [errorPassword, setErrorPassword] = useState(null)
	const [error, setError] = useState(null)

	const loginUserCallbacks = {
		invalidFields: () =>
			setError({
				overall: 'Invalid email address and/or password.',
			}),
		internalError: () =>
			setError({
				overall: 'Oops, something went wrong.',
			}),
	}

	const onSubmit = async () => {
		await loginUser({
			email: email,
			password: password,
			callback: loginUserCallbacks,
		})
	}

	return (
		<div className="bg-gradient-to-r from-primary to-secondary w-full h-[100vh] float-left px-5 md:px-[200px]">
			<div className=" h-[100vh] float-left text-neutral-900 w-full flex flex-col gap-10 items-center justify-center">
				<SvgIcon
					component={ArrowBack}
					className="absolute left-6 top-6 w-20 h-auto text-white cursor-pointer"
					fontSize="large"
					onClick={() => router.push('/')}
				/>
				<Image
					src={Logo}
					alt="logo"
					className="w-[200px] md:w-[300px] lg:w-[400px] h-auto"
				/>
				<div className="w-full bg-white rounded-xl shadow md:mt-0 sm:max-w-md xl:p-0 ">
					<div className="p-6 space-y-4">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Login</h1>

						{error && <span className="text-red-400 py-8">{error.overall}</span>}

						<form
							className="space-y-4 md:space-y-6"
							action="#"
						>
							<div>
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Your email
								</label>
								<TextInput
									type="email"
									placeholder="Email Address"
									value={email}
									onChange={(email, errorEmail) => {
										setError(null)
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
							<div>
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
								<div className="flex items-center h-5 justify-end mt-[10px]">
									<Link
										href="forgot-password"
										className="text-sm font-light text-gray-500 hover:underline text-[12px]"
									>
										Forgot password?{' '}
									</Link>
								</div>
							</div>
							<Button
								title="login"
								style=" w-full bg-primary text-white hover:bg-primary h-[40px]"
								loading={isLoggingIn}
								onClick={() => {
									if (!error) {
										if (email !== '' && password !== '') {
											onSubmit()
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
							<p className="text-sm font-light text-gray-500 pt-[20px]">
								Dont have an account?{' '}
								<Link
									href="sign-up"
									className="font-medium hover:underline"
								>
									Sign up here
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login
