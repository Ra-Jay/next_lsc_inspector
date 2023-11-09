'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../../../public/assets/images/logo.svg'
import WhiteLogo from '../../../public/assets/images/white-logo.svg'
import { SvgIcon } from '@mui/material'
import { Person, Settings } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import Button from '@components/Button/page'
import useUserStore from './../../useStore'
import configureAxios from '@configureAxios'
import Modal from '@components/Modal/page'
import useRefreshToken from '@hooks/useRefreshToken'
const dropdownMenu = [
	{
		title: 'Profile',
		icon: Settings,
		route: '/profile',
	},
]

function NavBar() {
	const router = useRouter()
	const [dropdown, setDropdown] = useState(false)
	const [isInDocs, setInDocs] = useState(false)
	const { user, logout } = useUserStore()
	const { refreshToken } = useRefreshToken()

	const [showModal, setShowModal] = useState(false);
	const [expired, setExpired] = useState(false);

	const isInLogin = router.pathname === '/login'
	const refresh = user?.user.refresh_token
	configureAxios(setShowModal)


	useEffect(() => {}, [user])

	useEffect(() => {console.log(showModal)}, [showModal])
	if (isInLogin) {
		return null
	}

	useEffect(() => {
		const expiredTimeout = setTimeout(() => {
		  setExpired(true);
		  setShowModal(true); // Update showModal in NavBar
		}, 900000);

		return () => clearTimeout(expiredTimeout);
	  }, []);

	const renderDropdown = () => {
		return (
			<div
				className={
					'z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-[300px] right-10 top-[70px] border border-gray-200 ' +
					(dropdown == false ? 'hidden' : '')
				}
			>
				<div className="px-4 py-4 text-sm text-white ">
					<div className="text-gray-700 text-lg font-semibold">Hi {user?.user.username}!</div>
					<div className="text-gray-700 font-medium truncate">{user?.user.email}</div>
				</div>
				<ul className="text-sm text-white ">
					{dropdownMenu &&
						dropdownMenu.map((item, index) => (
							<li
								key={index}
								onClick={() => {
									setDropdown(false)
									router.push(item.route)
								}}
							>
								<span className="text-primary block px-4 py-4 cursor-pointer hover:text-white hover:bg-secondary  hover:bg-opacity-50 ">
									{item.title}
								</span>
							</li>
						))}
				</ul>
				<div className="mb-[20px]">
					<span
						onClick={() => {
							logout()
							router.push('/')
						}}
						className="block px-4 cursor-pointer py-4 text-sm text-primary hover:text-white hover:bg-secondary hover:bg-opacity-50"
					>
						Sign out
					</span>
				</div>
			</div>
		)
	}

	const handleStayLoggedIn = () => {
		refreshToken(refresh)
		setShowModal(false)
		location.reload();
	}

	const renderContent = () => {
		return (
			<div>
				<div className="flex flex-col gap-y-12  items-center justify-center w-[300px]">Stay logged in?
					<div className='flex gap-x-32'>
						<Button title="Yes" style=" w-[100px] bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white  h-[40px] justify-center" onClick={handleStayLoggedIn}></Button>
						<Button title="Logout" style=" w-[100px] bg-primary text-white hover:bg-primary h-[40px] justify-center" onClick={() => logout()}></Button>
					</div>
				</div>
			</div>
		)
	}

	const renderAuthorizedNav = () => {

		return (
			<div className="z-40 float-left w-full h-[80px] shadow fixed bg-[#48BF91] text-neutral-900 pl-[25px] pr-[50px]">
				<div className="lg:block xl:block 2xl:block sm:hidden md:hidden xs:hidden">
					<div className={'w-3/4 h-[80px] float-left content-center items-center flex href-link'}>
						<Image
							src={WhiteLogo}
							alt="LSC logo"
							width={200}
							onClick={() => {
								router.push('/')
							}}
							className="cursor-pointer"
						/>
					</div>
					<div className={'h-[80px] w-1/4 float-left flex flex-row content-center items-center justify-end '}>
						<span className="font-bold text-white mr-2">{user?.user.username}</span>
						<div
							onClick={() => {
								setDropdown(!dropdown)
							}}
							className="h-[80px] flex content-center items-center"
						>
							{user && user.user.profile_image ? (
								<Image
									src={user.user.profile_image}
									alt="profile image"
									width={50}
									height={50}
									className="max-h-[50px] p-1 rounded-full ring-2 ring-gray-30 cursor-pointer"
								/>
							) : (
								<SvgIcon
									component={Person}
									className="text-white "
									style={{
										fontSize: 30,
									}}
								/>
							)}
						</div>
					</div>
					{renderDropdown()}
				</div>
				{showModal && (
					<Modal title="Your session has expired!"
					content={renderContent}
					style=" w-[300px]"
					></Modal>
				)}
			</div>
		)
	}

	const rendeUnauthorizedNav = () => {
		return (
			<div className="z-40 float-left w-full h-[80px] shadow-sm fixed bg-white border-b-[1px] text-neutral-900 px-[200px] ">
				<div className="lg:block xl:block 2xl:block sm:hidden md:hidden xs:hidden">
					<div className={'w-3/4 h-[80px] float-left content-center items-center flex href-link'}>
						<Image
							src={Logo}
							alt="LSC logo"
							width={200}
							onClick={() => {
								setInDocs(false)
								router.push('/')
							}}
							className="cursor-pointer"
						/>
						<Link
							href="/features"
							className="ml-[40px] mr-[20px] hover:border-b-2 border-primary hover:text-primary pb-[3px]"
							onClick={() => setInDocs(false)}
						>
							Features
						</Link>

						<Link
							href="/about-us"
							className="mx-[20px] hover:border-b-2 border-primary hover:text-primary pb-[3px]"
							onClick={() => setInDocs(false)}
						>
							About Us
						</Link>
						<Link
							href="/docs"
							className={`mx-[20px]`}
							onClick={() => setInDocs(true)}
						>
							<span className={`hover:border-b-2 border-primary hover:text-primary pb-[3px] ${isInDocs ? `border-b-2 text-primary` : ``} `}>
								Docs
							</span>
						</Link>
					</div>
					<div className={'h-[80px] w-1/4 float-left flex flex-row content-center items-center justify-between '}>
						<div></div>
						<div className="h-[80px] flex content-center items-center justify-between">
							<Button
								title="LOG IN"
								style=" hover:underline text-[14px] font-bold"
								onClick={() => {
									router.push('/login')
								}}
							/>
							<Button
								title="Try it now!"
								style=" bg-primary text-white hover:bg-primary text-[14px] font-bold"
								onClick={() => {
									router.push('/demo')
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return <div>{user ? renderAuthorizedNav() : rendeUnauthorizedNav()}</div>
}

export default NavBar
