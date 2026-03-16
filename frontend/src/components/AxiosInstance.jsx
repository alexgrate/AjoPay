import axios from 'axios'

const baseUrl=VITE_API_BASE_URL

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    }
})

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

AxiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh_token')

                if (!refreshToken) {
                    forceLogout()
                    return Promise.reject(error)
                }

                const response = await axios.post(`${baseUrl}/token/refresh/`, {
                    refresh: refreshToken,
                })

                const newAccessToken = response.data.access

                localStorage.setItem('access_token', newAccessToken)

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return AxiosInstance(originalRequest)

            } catch (refreshError) {
                forceLogout()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

const forceLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')

    window.location.href = '/login'
}

export default AxiosInstance