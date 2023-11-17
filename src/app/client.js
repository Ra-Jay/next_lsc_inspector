'use client'
import { Inter } from 'next/font/google'
import React, { useEffect, Suspense } from 'react'
import { SessionProvider } from 'next-auth/react'
import Layout from '@components/layout/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import configureAxios from '@configureAxios'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function Client({ children }) {
	const router = useRouter()

	useEffect(() => {
		const protectedRoutes = ['/login', '/sign-up', '/', '/demo']
		if (protectedRoutes.includes(router.pathname)) {
			configureAxios()
		}
	}, [router.pathname])

	return (
		<body className={inter.className}>
			<SessionProvider>
				<Suspense>
					<Layout>{children}</Layout>
				</Suspense>
				<ToastContainer />
			</SessionProvider>
		</body>
	)
}
