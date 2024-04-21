import {AxiosInstance} from 'axios';

import {getAxiosInstance} from './service/http';
import {StrapiAuthClient} from './strapi-auth-client';
import {StrapiQueryBuilder} from './strapi-query-builder';
import {StrapiClientOptions} from './types/base';


export class StrapiClient {
  private httpClient: AxiosInstance;
  private options: StrapiClientOptions;
  private isNotUserContent: boolean;
  private normalizeData: boolean;
  private debug: boolean;

  constructor(options: StrapiClientOptions) {
    this.debug = options.debug || false;
    this.httpClient = getAxiosInstance(options.url, options.apiToken);
    this.auth = this._initStrapiAuthClient(this.httpClient);
    this.normalizeData = options.normalizeData ? options.normalizeData : false;
    this.options = options;
    this.isNotUserContent = true;
  }

  auth: StrapiAuthClient;

  from<T = any>(contentName: string): StrapiQueryBuilder<T> {
    contentName === 'users' ? (this.isNotUserContent = false) : (this.isNotUserContent = true);
    const url = `${this.options.url}/${contentName}`;
    return new StrapiQueryBuilder<T>(url, this.httpClient, this.isNotUserContent, this.normalizeData, this.debug);
  }

  getApiUrl(): string {
    return this.options.url;
  }

  setToken(token: string): void {
    this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeToken(): void {
    delete this.httpClient.defaults.headers.common['Authorization'];
  }

  private _initStrapiAuthClient(axiosInstance: AxiosInstance) {
    return new StrapiAuthClient(axiosInstance, this.options);
  }
}
