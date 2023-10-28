// Interface data format used to return a unified format

export function resultSuccess<T = Recordable>(result: T, { message = 'ok' } = {}) {
  return {
    code: 0,
    result,
    message,
    type: 'success',
  };
}

export function resultPageSuccess<T = any>(pageNo: number, pageSize: number, list: T[], { message = 'ok' } = {}) {
  const pageData = pagination(pageNo, pageSize, list);

  return {
    ...resultSuccess({
      records: pageData,
      total: list.length,
    }),
    message,
  };
}

export function resultError(message = 'Request failed', { code = -1, result = null } = {}) {
  return {
    code,
    result,
    message,
    type: 'error',
  };
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize);
  const ret = offset + Number(pageSize) >= array.length ? array.slice(offset, array.length) : array.slice(offset, offset + Number(pageSize));
  return ret;
}

export interface requestParams {
  method: string;
  body: any;
  headers?: { authorization?: string };
  query: any;
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.authorization;
}

/**
 * expample:
 * enum API {
 *   GetProductList = '/product/list',
 * }
 * export const getProductList = () => {
 *   return defHttp.get(
 *     { url: API.GetProductList },
 *     {
 *       //注意 这里需要指定 添加到url的前缀为/jeecgboot/mock
 *       //这样完整的路径就是 /jeectboot/mock/product/list
 *       //mockserver中配置的mockmethod都是以/jeecgboot/mock开头的
 *       apiUrl: baseUrl,
 *     }
 *   );
 * };
 */

//TODO 接口父路径（写死不够灵活）
export const baseUrl = '/jeecgboot/mock';
