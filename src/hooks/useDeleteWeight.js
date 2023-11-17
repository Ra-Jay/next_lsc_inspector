'use client'

import { useState } from 'react'
import WeightsService from '@services/WeightsService'

const useDeleteWeight = () => {
	const [isDeleting, setIsDeleting] = useState(false)

	const deleteWeight = async ({ token, id, callback }) => {
		setIsDeleting(true)

		let responseCode
		let deletedWeight
		if (id) {
			try {
				const { status, data } = await WeightsService.deleteById(token, id)
				responseCode = status
				deletedWeight = data
			} catch (error) {
				console.error('Error deleting Weight:', error)
				responseCode = error.response
			}
		}
		switch (responseCode) {
			case 200:
				await callback.success()
				break
			case 404:
				await callback.notFound()
				break
			case 500:
				await callback.internalError()
				break
		}
	}

	return { isDeleting, deleteWeight }
}

export default useDeleteWeight
