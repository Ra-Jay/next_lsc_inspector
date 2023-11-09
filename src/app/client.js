'use client'
import { Inter } from 'next/font/google'
import React, { Suspense } from 'react'
import { SessionProvider } from 'next-auth/react'
import Layout from '@components/layout/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import configureAxios from '@configureAxios'

const inter = Inter({ subsets: ['latin'] })

export default function Client({ children }) {
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
