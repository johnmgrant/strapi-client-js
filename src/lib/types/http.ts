export type HttpRequestConfig<D> = {
  url?: string;
  opts?: RequestInit;
  data?: D;
};

export type HttpResponse<T> = Response & {
  data: T;
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
  Authorization: '',
};

export type HttpClientDefaults = {
  url: string;
  headers: {
    common: {[K in keyof typeof defaultHeaders]?: (typeof defaultHeaders)[K]};
  };
};
