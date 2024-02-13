'use client'

import { useState } from 'react'
import FilesServices from '@services/FilesServices'

const useUpload = () => {
	const [isUploading, setIsUploading] = useState(false)

	const uploadFile = async ({ body }) => {
		setIsUploading(true)

		let responseCode
		let fileUploaded
		try {
			const { status, data } = await FilesServices.upload(body)

			responseCode = status
			fileUploaded = data
			setIsUploading(false)

			return { data, status }
		} catch (error) {
			responseCode = error.response.status
		}

		switch (responseCode) {
			case 201:
				break
			case 401:
				await callback.invalidFields()
				break
			case 500:
				await callback.internalError()
				break
		}

		setIsUploading(false)
	}
	return { isUploading, uploadFile }
}

export default useUpload
