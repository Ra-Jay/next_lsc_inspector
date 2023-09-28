'use client'

import { useState } from 'react'
import FilesServices from '@services/FilesServices'

const useUpload = () => {
	const [isUploading, setIsUploading] = useState(false)

		const uploadFile = async ({ body }) => {
			setIsUploading(true)

			let responseCode
			let fileUploaded
			console.log(body)
			try {
			const { status, data } = await FilesServices.upload(body)

			responseCode = status
			fileUploaded = data

			return { data, status }
		} catch (error) {
			console.log(error)
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
