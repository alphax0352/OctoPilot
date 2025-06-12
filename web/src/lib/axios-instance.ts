import axios from 'axios'

const AxiosInstance = axios.create()

AxiosInstance.interceptors.response.use(
  (response) => {
    // Can be modified response
    return response
  },
  (error) => {
    // Handle response errors here
    if (error.response.status === 404) {
      return Promise.reject('Server is not running')
    }
    return Promise.reject(error.response.data?.error)
  }
)

const AxiosInstanceFlask = axios.create({
  baseURL: 'http://localhost:3830/api',
})

AxiosInstanceFlask.interceptors.response.use(
  (response) => {
    // Can be modified response
    return response
  },
  (error) => {
    // Handle response errors here
    if (error.response.status === 404) {
      return Promise.reject('Server is not running')
    }
    return Promise.reject(error.response.data?.error)
  }
)

export { AxiosInstance, AxiosInstanceFlask }
