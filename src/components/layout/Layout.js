'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useUserStore from '../../useStore'

import Nav from '@components/Nav/page'
import Footer from '@components/Footer/page'
import Sidebar from '@components/sidebar'
import Spinner from '@components/Loading/spinner'
import String from '@utils/string'

const protectedPages = ['/dashboard', '/main', '/history', '/profile']

const redirectDashboard = ['/login', '/sign-up', '/', '/demo', '/docs']

function Homepage({ children }) {
	const router = useRouter()
	const pathname = usePathname()
	const [loading, setLoading] = useState(true)
	const { user, isAuthenticated } = useUserStore()

	useEffect(() => {
		const securedPage = async () => {
			if (isAuthenticated && user && redirectDashboard.includes(pathname)) {
				setLoading(false)
				router.push('/main')
			} else if (!user && protectedPages.includes(pathname)) {
				window.location.href = window.location.origin + '/login'
				setLoading(false)
			}
			setLoading(false)
		}
		securedPage()
	}, [isAuthenticated, pathname, router, user])

	return (
		<div className="float-left w-full min-h-full bg-white text-black ">
			{!loading && isAuthenticated && user && (
				<div className="w-full min-h-[100vh] float-left">
					<Nav />
					<div className="w-full min-h-[100vh] bg-gray-100 float-left relative">
						<div className="lg:block 2xl:block sm:hidden xs:hidden md:hidden w-[15%] min-h-[100vh] fixed float-left">
							<Sidebar menu={String.menu} />
						</div>
						<div className="lg:w-[85%] min-h-[100vh] 2xl:w-[85%] sm:w-full xs:w-full md:w-full float-left p-[20px] mt-[80px] lg:ml-[15%] 2xl:ml-[15%]">
							{children}
						</div>
					</div>
				</div>
			)}
			{!loading && !user && (
				<div className="w-full float-left bg-white  text-black  min-h-[100px]">
					{pathname == '/login' || pathname == '/sign-up' ? (
						<>
							<div className="w-full float-left">{children}</div>
						</>
					) : (
						<>
							<Nav />
							<div className="w-full float-left flex flex-col">
								{children}
								<Footer />
							</div>
						</>
					)}
				</div>
			)}
			{loading && <Spinner />}
		</div>
	)
}

export default Homepage
