'use client'

import { useState, useEffect } from 'react'
import WeightsService from '@services/WeightsService'

const useWeight = (token, id, callback) => {
	const [isRetrieving, setIsRetrieving] = useState(false)
	const [weights, setWeight] = useState(null)

	useEffect(() => {
		const getWeights = async () => {
			setIsRetrieving(true)

			let responseCode
			let retrievedWeights

			try {
				const { status, data } = await WeightsService.getAll(token, id)

				responseCode = status
				retrievedWeights = data
			} catch (error) {
				console.log(error)
				responseCode = error.response.status
			}

			switch (responseCode) {
				case 200:
					setWeight(retrievedWeights)
					break
				case 401:
					await callback.invalidFields()
					break
				case 500:
					await callback.internalError()
					break
			}

			setIsRetrieving(false)
		}
		getWeights()
	}, [token, id, callback])

	return { isRetrieving, weights }
}

export default useWeight
