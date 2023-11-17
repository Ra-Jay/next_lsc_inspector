import axios from 'axios'
import config from '@services/config'

 const configureAxios = (setShowModal) => {
  axios.defaults.baseURL = config.API_URL
  axios.defaults.timeout = 40000
  axios.defaults.headers.common['Content-Type'] = 'application/json'

  // add a request interceptor to all the axios requests
  // that are going to be made in the site. The purpose
  // of this interceptor is to verify if the access token
  // is still valid and renew it if needed and possible
  axios.interceptors.request.use(
    (requestConfig) => {
      // if the current request doesn't include the config's base
      // API URL, we don't attach the access token to its authorization
      // because it means it is an API call to a 3rd party service
      if (requestConfig.baseURL !== config.API_URL) {
        return requestConfig
      }

      // Get access token from cookies for every api request
      /*const userData = JSON.parse(localStorage.getItem("userAuth"))
      const accessToken = userData.state.user.user.access_token
      requestConfig.headers.authorization = accessToken
        ? `Bearer ${accessToken}`
        : null*/

      return requestConfig
    },
    (error) => Promise.reject(error)
  )

  axios.interceptors.response.use(null, async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Expired Token!")
      setShowModal(true); // Update showModal in NavBar
      return Promise.reject(error);
    }
    return Promise.reject(error);
  });
}
export default configureAxios;
