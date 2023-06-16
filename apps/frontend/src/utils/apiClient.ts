import axios, { AxiosInstance } from 'axios'

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.BACKEND_HOST,
    headers: {
      // Replace 'YourAccessToken' with the actual token for authentication
      // You can also use other headers like 'Authorization: Bearer YourAccessToken'
      Authorization: `Bearer ${process.env.BACKEND_TOKEN}`,
    },
  })

  return instance
}

let instance: AxiosInstance | null = null

function getBackendClient(): AxiosInstance {
  if (
    process.env.BACKEND_HOST === undefined ||
    process.env.BACKEND_TOKEN === undefined
  ) {
    throw new Error('BACKEND_HOST and BACKEND_TOKEN must be defined')
  }

  if (instance === null) {
    instance = createAxiosInstance()
  }
  return instance
}

export default getBackendClient
