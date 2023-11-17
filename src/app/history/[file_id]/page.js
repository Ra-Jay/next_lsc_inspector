'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { saveAs } from 'file-saver'

import Button from '@components/Button/page'
import Modal from '@components/Modal/page'
import Skeleton from '@components/Skeleton/Skeleton'

import useUserStore from '@useStore'
import useFile from '@hooks/useFile'

const Page = ({ params }) => {
	const router = useRouter()
	const { user } = useUserStore()
	const { file } = useFile(user?.user.access_token, params.file_id)

	const renderContent = () => {
		return (
			<>
				{file ? (
					<div className="flex flex-col items-center gap-[20px]">
						<Image
							src={file?.url}
							alt="result"
							width={500}
							height={100}
							className="max-h-[200px] max-w-[500px] md:max-h-[350px] md:max-w-[600px] w-full h-auto	"
							//style={{ height: 'auto', maxHeight: '350px', maxWidth: '600px' }}
						/>
						<div className="w-full max-h-[90vh] max-w-[90vw]  md:max-w-[100vw] md:max-h-[100vh] flex flex-col gap-[10px] overflow-hidden">
							<div>
								<b>Classification: </b>

								<span className={file?.classification == 'Good' ? `text-primary font-bold` : `text-red-500 font-bold`}>{file.classification}</span>
							</div>
							<div>
								<b>Accuracy: </b>
								<span>{file?.accuracy}</span>
							</div>
							<div>
								<b>Error Rate: </b>
								<span>{file?.error_rate}</span>
							</div>
							<div>
								<b>Size: </b>
								<span>{file?.size}</span>
							</div>
							<div>
								<b>Dimension: </b>
								<span>{file?.dimension}</span>
							</div>
							<div>
								<b>Date Created: </b>
								<span>{file?.created_at}</span>
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
				) : (
					<Skeleton />
				)}
			</>
		)
	}

	return (
		<Modal
			title={file?.name}
			onClose={() => {
				router.push('/history')
			}}
			content={renderContent}
			footer={() => {
				return (
					<div className="w-full flex justify-end">
						<Button
							style={' bg-primary text-white m-[10px]'}
							title="Export"
							onClick={() => {
								saveAs(file.url, 'result.png')
							}}
						/>
					</div>
				)
			}}
		/>
	)
}

export default Page
