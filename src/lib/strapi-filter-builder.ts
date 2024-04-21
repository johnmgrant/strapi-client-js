import {AxiosInstance} from 'axios';

import {generateQueryString, generateQueryFromRawString, stringToArray} from './helpers';
import {StrapiClientHelper} from './strapi-client-helper';
import {InferedTypeFromArray, PublicationState, StrapiApiResponse} from './types/base';
import {CrudSorting, PopulateDeepOptions, RelationalFilterOperators} from './types/crud';


export class StrapiFilterBuilder<T> extends StrapiClientHelper<T> {
  private httpClient: AxiosInstance;
  private normalizeData: boolean;
  private debug: boolean;

  constructor(
    url: string,
    axiosInstance: AxiosInstance,
    normalizeData: boolean,
    debug: boolean,
    private isNotUserContent: boolean,
  ) {
    super(url);
    this.debug = debug;
    this.url = url;
    this.httpClient = axiosInstance;
    this.normalizeData = normalizeData;
  }

  async get(): Promise<StrapiApiResponse<T>> {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.log(this.url);
    }
    return new Promise<StrapiApiResponse<T>>((resolve) => {
      if (this.isNotUserContent) {
        this.httpClient
          .get<StrapiApiResponse<T>>(this.url)
          .then((res) => {
            resolve(this.normalizeData ? this._returnDataHandler(res.data) : res.data);
          })
          .catch((err) => {
            if (err) {
              resolve(this._returnErrorHandler(err));
            }
          });
      }
      if (!this.isNotUserContent) {
        this.httpClient
          .get<T>(this.url)
          .then((res) => {
            resolve({data: res.data, meta: undefined});
          })
          .catch((err) => {
            if (err) {
              resolve(this._returnErrorHandler(err));
            }
          });
      }
    });
  }

  equalTo(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string | number) {
    this.url = this._generateFilter({
      field,
      operator: 'eq',
      value,
    });
    return this;
  }

  notEqualTo(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string | number) {
    this.url = this._generateFilter({
      field,
      operator: 'ne',
      value,
    });
    return this;
  }

  lessThan(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string | number) {
    this.url = this._generateFilter({
      field,
      operator: 'lt',
      value,
    });
    return this;
  }

  lessThanOrEqualTo(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string | number) {
    this.url = this._generateFilter({
      field,
      operator: 'lte',
      value,
    });
    return this;
  }

  greaterThan(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string | number) {
    this.url = this._generateFilter({
      field,
      operator: 'gt',
      value,
    });
    return this;
  }

  greaterThanOrEqualTo(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string | number) {
    this.url = this._generateFilter({
      field,
      operator: 'gte',
      value,
    });
    return this;
  }

  containsCaseSensitive(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string) {
    this.url = this._generateFilter({
      field,
      operator: 'contains',
      value,
    });
    return this;
  }

  notContainsCaseSensitive(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string) {
    this.url = this._generateFilter({
      field,
      operator: 'notContains',
      value,
    });
    return this;
  }

  contains(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string) {
    this.url = this._generateFilter({
      field,
      operator: 'containsi',
      value,
    });
    return this;
  }

  notContains(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string) {
    this.url = this._generateFilter({
      field,
      operator: 'notContainsi',
      value,
    });
    return this;
  }

  isNull(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string) {
    this.url = this._generateFilter({
      field,
      operator: 'null',
      value,
    });
    return this;
  }

  isNotNull(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string) {
    this.url = this._generateFilter({
      field,
      operator: 'notNull',
      value,
    });
    return this;
  }

  between(field: Extract<keyof InferedTypeFromArray<T>, string>, value: Array<any>) {
    this.url = this._generateFilter({
      field,
      operator: 'between',
      value,
    });
    return this;
  }

  startsWith(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string) {
    this.url = this._generateFilter({
      field,
      operator: 'startsWith',
      value,
    });
    return this;
  }

  endsWith(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string) {
    this.url = this._generateFilter({
      field,
      operator: 'endsWith',
      value,
    });
    return this;
  }

  in(field: Extract<keyof InferedTypeFromArray<T>, string>, value: string[]) {
    this.url = this._generateFilter({
      field,
      operator: 'in',
      value,
    });
    return this;
  }

  filterDeep(path: string, operator: RelationalFilterOperators, value: string | number | Array<string | number>) {
    this.url = this._genrateRelationsFilter({path: stringToArray(path), operator, value});
    return this;
  }

  sortBy(sort: CrudSorting<InferedTypeFromArray<T>>) {
    this.url = this._generateSort(sort);
    return this;
  }

  paginate(page: number, pageSize: number) {
    const paginateRawQuery = `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    this.url = this._handleUrl(generateQueryFromRawString(paginateRawQuery));
    return this;
  }

  paginateByOffset(start: number, limit: number) {
    const paginateRawQuery = `pagination[start]=${start}&pagination[limit]=${limit}`;
    this.url = this._handleUrl(generateQueryFromRawString(paginateRawQuery));
    return this;
  }

  withDraft() {
    this.url = this._handleUrl(`publicationState=${PublicationState.PREVIEW}`);
    return this;
  }

  onlyDraft() {
    this.url = this._handleUrl(`publicationState=${PublicationState.PREVIEW}&filters[publishedAt][$null]=true`);
    return this;
  }

  setLocale(localeCode: string) {
    this.url = this._handleUrl(`locale=${localeCode}`);
    return this;
  }

  populate() {
    const obj = {
      populate: '*',
    };
    this.url = this._handleUrl(generateQueryString(obj));
    return this;
  }

  populateWith<Q>(
    relation: T extends Array<infer U> ? keyof U : keyof T,
    selectFields?: Array<keyof Q>,
    level2?: boolean,
  ) {
    const obj = {
      populate: {
        [relation]: {
          fields: selectFields,
          populate: level2 ? '*' : null,
        },
      },
    };
    this.url = this._handleUrl(generateQueryString(obj));
    return this;
  }

  populateDeep(populateDeepValues: PopulateDeepOptions[]) {
    this.url = this._generatePopulateDeep(populateDeepValues);
    return this;
  }
}
