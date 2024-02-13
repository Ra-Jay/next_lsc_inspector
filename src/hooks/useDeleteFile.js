import { useState } from 'react'
import FilesServices from '@services/FilesServices'

const useDeleteFile = () => {
	const [isDeleting, setIsDeleting] = useState(false)

	const deleteFile = async ({ token, id, callback }) => {
		setIsDeleting(true)

		let responseCode
		let deletedFile
		if (id) {
			try {
				const { status, data } = await FilesServices.deleteById(token, id)
				responseCode = status
				deletedFile = data
			} catch (error) {
				console.error('Error deleting file:', error)
				responseCode = error.response
			}
		} else {
			try {
				const { status, data } = await FilesServices.deleteAll(token)
				responseCode = status
				deletedFile = data
			} catch (error) {
				console.error('Error deleting file:', error)
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

	return { isDeleting, deleteFile }
}

export default useDeleteFile
