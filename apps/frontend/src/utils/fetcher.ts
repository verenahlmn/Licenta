type FetcherConfig<T = unknown, R = unknown> = {
  baseUrl?: string
  contentType?:
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
  headers?: HeadersInit
  params?: Record<string, string>
  timeout?: number
  transformRequest?: (
    data: NonNullable<T>,
    headers: HeadersInit
  ) => NonNullable<T>
  transformResponse?: (data: unknown) => R
  validateStatus?: (status: number) => boolean
  token?: string
}

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type FetcherResponse<T, R> = {
  data: R
  status: number
  statusText: string
  headers: Record<string, string>
  config: FetcherConfig<T, R>
  request: Response
}

class Fetcher {
  static defaults: FetcherConfig = {}

  static async request<T = unknown, R = unknown>(
    method: FetchMethod,
    url: string,
    data?: T,
    config: FetcherConfig<T, R> = {}
  ): Promise<FetcherResponse<T, R>> {
    if (typeof fetch === 'undefined') {
      throw new Error(
        'fetch is not defined. If you are running this on the backend, make sure to install a fetch-compatible library.'
      )
    }

    const {
      baseUrl = Fetcher.defaults.baseUrl || '',
      contentType = Fetcher.defaults.contentType || 'application/json',
      headers: headersConfig = {},
      params: paramsConfig = {},
      timeout = Fetcher.defaults.timeout,
      transformRequest = Fetcher.defaults.transformRequest,
      transformResponse = Fetcher.defaults.transformResponse,
      validateStatus = Fetcher.defaults.validateStatus ||
        ((status: number) => status >= 200 && status < 300),
      token = Fetcher.defaults.token,
    } = config

    let fetchUrl: URL | string

    if (/^(https?|ftp):\/\//.test(url)) {
      fetchUrl = new URL(url)
    } else if (baseUrl) {
      try {
        fetchUrl = new URL(url, baseUrl)
      } catch (e) {
        throw new Error(`Invalid URL: ${url}`)
      }
    } else {
      fetchUrl = url
    }

    if (paramsConfig || Fetcher.defaults.params) {
      const urlParams = { ...Fetcher.defaults.params, ...paramsConfig }
      if (typeof fetchUrl === 'string') {
        let queryString = ''
        Object.keys(urlParams).forEach((key) => {
          const value = urlParams[key]
          queryString += `${key}=${encodeURIComponent(value)}&`
        })
        fetchUrl = `${fetchUrl}?${queryString.slice(0, -1)}`
      } else {
        Object.keys(urlParams).forEach((key) =>
          (fetchUrl as URL).searchParams.append(key, urlParams[key])
        )
      }
    }

    let headers: HeadersInit = {
      ...Fetcher.defaults.headers,
      ...headersConfig,
      'Content-Type': contentType,
    }

    // Set the Authorization header if a token is provided
    if (token) {
      headers = {
        ...headers,
        Authorization: `Bearer ${token}`,
      }
    }

    if (data && transformRequest) {
      data = transformRequest(data as NonNullable<T>, headers) as T
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    }

    if (data) {
      if (!(data instanceof FormData)) {
        headers = {
          ...headers,
          'Content-Type': contentType,
        }
      }

      if (data instanceof FormData) {
        fetchOptions.body = data
      } else if (contentType === 'application/x-www-form-urlencoded') {
        fetchOptions.body = new URLSearchParams(data).toString()
      } else if (contentType === 'application/json') {
        fetchOptions.body = JSON.stringify(data)
      }
    }

    const controller = new AbortController()
    fetchOptions.signal = controller.signal
    if (timeout) {
      setTimeout(() => controller.abort(), timeout)
    }

    console.info('[Fetcher] ', fetchUrl, fetchOptions)
    // TODO: Implement check if fetchOptions has body for method that require it

    const response = await fetch(fetchUrl.toString(), fetchOptions)

    if (!validateStatus(response.status)) {
      console.error(response)
      throw new Error(`Request failed with status code ${response.status}`)
    }

    let responseData = response.headers
      .get('content-type')
      ?.includes('application/json')
      ? await response.json()
      : await response.text()

    if (transformResponse) {
      responseData = transformResponse(responseData) as R
    }

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      config,
      request: response,
    }
  }

  static get<R = unknown>(
    url: string,
    config?: FetcherConfig<never, R>
  ): Promise<FetcherResponse<never, R>> {
    return Fetcher.request<never, R>('GET', url, undefined, config)
  }

  static post<T = unknown, R = unknown>(
    url: string,
    data?: T,
    config?: FetcherConfig<T, R>
  ): Promise<FetcherResponse<T, R>> {
    return Fetcher.request<T, R>('POST', url, data, config)
  }

  static put<T = unknown, R = unknown>(
    url: string,
    data?: T,
    config?: FetcherConfig<T, R>
  ): Promise<FetcherResponse<T, R>> {
    return Fetcher.request<T, R>('PUT', url, data, config)
  }

  static delete<T = unknown, R = unknown>(
    url: string,
    config?: FetcherConfig<T, R>
  ): Promise<FetcherResponse<T, R>> {
    return Fetcher.request<T, R>('DELETE', url, undefined, config)
  }
}

export default Fetcher
