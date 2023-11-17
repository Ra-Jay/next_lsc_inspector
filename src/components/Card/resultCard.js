import Image from 'next/image'

const ResultCard = (props) => {
	return (
		<div
			className="bg-blue-50 w-full h-max min-h-[200px] p-[20px] flex flex-col gap-4 justify-between shadow rounded-md"
			// key={props.key}
			onClick={props.onClick()}
		>
			<div className="flex justify-between">
				<span className="text-xl font-bold break-words max-w-[100%] ">{props.data.name}</span>
				{/* <span className="text-primary">Successful</span> */}
			</div>
			<div className="w-full flex flex-col gap-2">
				<div className="flex justify-between">
					<span>
						<span className={` ${props.data.classification === 'Good' ? `text-primary` : `text-red-400`} font-bold`}>
							{props.data.classification}
						</span>
					</span>
					<span>Accuracy: {props.data.accuracy}</span>
				</div>
				<Image
					src={props.data.url}
					alt="image"
					width={200}
					height={100}
					className="max-w-full mx-auto"
				/>
			</div>
		</div>
	)
}

export default ResultCard
