import axios from 'axios'
import config from './config'

const BASE_URL = `${config.API_URL}/users`

const UsersService = {
    signup: (user) => axios.post(`${BASE_URL}/register`, user),
    login: (user) => axios.post(`${BASE_URL}/login`, user),
    edit: (id, token, body) =>
        axios.put(`${BASE_URL}/${id}/edit`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    editPassword: (id, token, body) =>
        axios.put(`${BASE_URL}/${id}/password/edit`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    edit_profile_picture: (id, token, profile_image) =>
        axios.put(`${BASE_URL}/${id}/profile-image/edit`, profile_image, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Important for file upload
            },
        }),
    refreshToken: (refreshToken) => axios.get(`${config.API_URL}/users/token/refresh`, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              'Content-Type': 'application/json'
          }})
}

export default UsersService
