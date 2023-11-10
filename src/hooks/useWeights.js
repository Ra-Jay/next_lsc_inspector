'use client'

import { useState, useEffect } from 'react'
import WeightsService from '@services/WeightsService'

const useWeights = (token, id, callback) => {
	const [isRetrieving, setIsRetrieving] = useState(false)
	const [weights, setWeights] = useState(null)

	const deleteWeight = async ({ id, callback }) => {
		setIsRetrieving(true)

		let responseCode
		let createdWeight

		try {
			const { status, data } = await WeightsService.delete(token, id)

			responseCode = status
			createdWeight = data
		} catch (error) {
			console.log(error)
			responseCode = error.response.status
		}

		switch (responseCode) {
			case 200:
				await callback.success()
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
					setWeights(retrievedWeights)
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
	}, [])

	const fetchWeights = async ({ callback }) => {
		setIsRetrieving(true)

		let responseCode
		let retrievedWeights

		try {
			const { status, data } = await WeightsService.getAll(token)

			responseCode = status
			retrievedWeights = data
		} catch (error) {
			responseCode = error.response.status
		}

		switch (responseCode) {
			case 200:
				setWeights(retrievedWeights)
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

	return { isRetrieving, weights, fetchWeights, deleteWeight }
}

export default useWeights
