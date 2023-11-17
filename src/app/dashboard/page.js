'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Container from '@components/container'
import ResultCard from '@components/Card/resultCard'
import Card from '@components/Card/page'
import useUserStore from '@useStore'
import useFiles from '@hooks/useFiles'
import Skeleton from '@components/Loading/skeleton'

const Dashboard = () => {
	const router = useRouter()
	const { user } = useUserStore()
	const { isRetrieving, files } = useFiles(user?.user.access_token)

	// const [selected, setSelected] = useState(null)
	const goodFiles = files?.data?.filter((file) => file.classification === 'Good')
	const noGoodFiles = files?.data?.filter((file) => file.classification === 'No Good')
	const sortedFiles = files?.data?.slice().sort((a, b) => b.timestamp - a.timestamp)
	const recentFiles = sortedFiles?.slice(0, 3)

	return (
		<Container>
			{!isRetrieving ? (
				<>
					<div className="w-full flex flex-col gap-x-1 items-left justify-between mb-4 p-6">
						<h1 className="font-bold text-[25px]">Dashboard</h1>
					</div>
					<div className="px-6 w-full flex flex-col gap-10">
						<div className="flex flex-col gap-4">
							<span className="font-bold">Result</span>
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
								<Card
									data={goodFiles}
									title={'Good'}
									total={files?.data.length}
								/>
								<Card
									data={noGoodFiles}
									title={'No Good'}
									total={files?.data.length}
								/>
								<Card
									data={files?.data}
									title={'Accuracy'}
									total={files?.data.length}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-4 relative">
							<span className="font-bold">Recent</span>
							<span
								className="absolute top-0 right-0 text-primary cursor-pointer hover:underline"
								onClick={() => router.push('/history')}
							>
								See all
							</span>
							<div className="w-full h-fit grid grid-cols-1 gap-4 md:grid-cols-3">
								{recentFiles &&
									recentFiles.map((item, index) => (
										<ResultCard
											onClick={() => {}}
											key={index}
											data={item}
										/>
									))}
							</div>
						</div>
					</div>{' '}
				</>
			) : (
				<div className="flex gap-2">
					{[0, 1, 2, 3].map((item) => (
						<Skeleton
							key={item}
							style=" h-[150px]"
						/>
					))}
				</div>
			)}
		</Container>
	)
}

export default Dashboard
