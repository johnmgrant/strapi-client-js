import {
  HttpClientDefaults,
  HttpRequestConfig,
  HttpResponse,
  defaultHeaders,
} from '../types/http';

export class HttpClient {
  public headers = defaultHeaders;

  public defaults: HttpClientDefaults = {
    url: '',
    headers: {
      common: {...this.headers},
    },
  };

  private defaultConfig: RequestInit = {};

  constructor(
    url: string,
    apiToken?: string,
    {body, ...customConfig} = {} as RequestInit,
  ) {
    this.defaults.url = url;

    if (apiToken) {
      this.headers.Authorization = `Bearer ${apiToken}`;
    }

    const config: RequestInit = {
      method: body ? 'POST' : 'GET',
      ...customConfig,
      headers: {
        ...this.headers,
        ...customConfig.headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    this.defaultConfig = config;
  }

  get<T = any, R = HttpResponse<T>, D = any>(
    resource: string,
    config?: HttpRequestConfig<D>,
  ): Promise<R> {
    if (resource.slice(0, 1) !== '/') {
      resource = `/${resource}`;
    }

    const url = this.defaults.url
      ? `${this.defaults.url}${resource}`
      : resource;
    return fetch(url, {
      ...this.defaultConfig,
      ...config?.opts,
      method: 'GET',
    }).then(async (response) => {
      if (response.ok) {
        return await response.json();
      } else {
        const errorMessage = await response.text();
        return Promise.reject(new Error(errorMessage));
      }
    });
  }

  delete<T = any, R = HttpResponse<T>, D = any>(
    resource: string,
    config?: HttpRequestConfig<D>,
  ): Promise<R> {
    if (resource.slice(0, 1) !== '/') {
      resource = `/${resource}`;
    }

    const url = this.defaults.url
      ? `${this.defaults.url}${resource}`
      : resource;
    return fetch(url, {
      ...this.defaultConfig,
      ...config?.opts,
      method: 'DELETE',
    }).then(async (response) => {
      if (response.ok) {
        return await response.json();
      } else {
        const errorMessage = await response.text();
        return Promise.reject(new Error(errorMessage));
      }
    });
  }

  post<T = any, R = HttpResponse<T>, D = any>(
    resource: string,
    data?: D,
    config?: HttpRequestConfig<D>,
  ): Promise<R> {
    if (resource.slice(0, 1) !== '/') {
      resource = `/${resource}`;
    }

    const url = this.defaults.url
      ? `${this.defaults.url}${resource}`
      : resource;
    return fetch(url, {
      ...this.defaultConfig,
      ...config?.opts,
      method: 'POST',
    }).then(async (response) => {
      if (response.ok) {
        return await response.json();
      } else {
        const errorMessage = await response.text();
        return Promise.reject(new Error(errorMessage));
      }
    });
  }

  put<T = any, R = HttpResponse<T>, D = any>(
    resource: string,
    data?: D,
    config?: HttpRequestConfig<D>,
  ): Promise<R> {
    if (resource.slice(0, 1) !== '/') {
      resource = `/${resource}`;
    }

    const url = this.defaults.url
      ? `${this.defaults.url}${resource}`
      : resource;
    return fetch(url, {
      ...this.defaultConfig,
      ...config?.opts,
      method: 'PUT',
    }).then(async (response) => {
      if (response.ok) {
        return await response.json();
      } else {
        const errorMessage = await response.text();
        return Promise.reject(new Error(errorMessage));
      }
    });
  }
}
