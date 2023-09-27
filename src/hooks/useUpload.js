import { useState } from 'react'
import FilesServices from '@services/FilesServices'

	const useUpload = () => {
		const [isUploading, setIsUploading] = useState(false)

		const uploadFile = async ({ body, authorization }) => {
			setIsUploading(true)

			let responseCode
			let fileUploaded
			console.log(body, authorization)
			try {
				const { status, data } = await FilesServices.upload(body, authorization)

				responseCode = status
				fileUploaded = data
				return(fileUploaded)
			} catch (error) {
				responseCode = error.message
				console.log(responseCode)
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
