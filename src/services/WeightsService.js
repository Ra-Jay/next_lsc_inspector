import axios from 'axios'
import config from './config'

const BASE_URL = `${config.API_URL}/weights`

const WeightsService = {
	create: (token, weight) =>
		axios.post(`${BASE_URL}/deploy`, weight, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),
	delete: (id) => axios.delete(`${BASE_URL}/${id}/delete`),
	getAll: (token) =>
		axios.get(`${BASE_URL}/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),
	getById: (id) => axios.get(`${BASE_URL}/${id}`, id),
}

export default WeightsService
