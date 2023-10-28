import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { RequestOptions, Result, UploadFileParams, UploadFileCallBack } from '/#/axios';
import type { CreateAxiosOptions } from './axiosTransform';
import axios from 'axios';
import qs from 'qs';
import { AxiosCanceler } from './axiosCancel';
import { isFunction } from '/@/utils/is';
import { cloneDeep } from 'lodash-es';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { RequestEnum } from '/@/enums/httpEnum';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';

const { createMessage } = useMessage();
export * from './axiosTransform';

/**
 * @description:  axios module
 */
export class VAxios {
  private axiosInstance: AxiosInstance;
  /**
   * 只读属性必须在声明时初始化或者构造函数中初始化
   * @private
   */
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * @description:  Create axios instance
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config);
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * @description: Reconfigure axios
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  /**
   * @description: Set general header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  /**
   * @description: Interceptor configuration
   */
  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) {
      return;
    }
    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform;

    const axiosCanceler = new AxiosCanceler();

    // 请求侦听器配置处理
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      // If cancel repeat request is turned on, then cancel repeat request is prohibited
      // @ts-ignore
      const { ignoreCancelToken } = config.requestOptions;

      const ignoreCancel = ignoreCancelToken !== undefined ? ignoreCancelToken : this.options.requestOptions?.ignoreCancelToken;

      !ignoreCancel && axiosCanceler.addPending(config);
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options);
      }
      return config;
    }, undefined);

    // 请求拦截器错误捕获
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // 响应结果拦截器错误捕获
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
  }

  /**
   * 文件上传
   */
  //--@updateBy-begin----author:liusq---date:20211117------for:增加上传回调参数callback------
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams, callback?: UploadFileCallBack) {
    //--@updateBy-end----author:liusq---date:20211117------for:增加上传回调参数callback------
    const formData = new window.FormData();
    const customFilename = params.name || 'file';

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }
    const glob = useGlobSetting();
    config.baseURL = glob.uploadUrl;
    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, params.data[key]);
      });
    }

    return this.axiosInstance
      .request<T>({
        ...config,
        method: 'POST',
        data: formData,
        headers: {
          'Content-type': ContentTypeEnum.FORM_DATA,
          ignoreCancelToken: true,
        },
      })
      .then((res: any) => {
        //--@updateBy-begin----author:liusq---date:20210914------for:上传判断是否包含回调方法------
        if (callback?.success && isFunction(callback?.success)) {
          callback?.success(res?.data);
          //--@updateBy-end----author:liusq---date:20210914------for:上传判断是否包含回调方法------
        } else if (callback?.isReturnResponse) {
          //--@updateBy-begin----author:liusq---date:20211117------for:上传判断是否返回res信息------
          return Promise.resolve(res?.data);
          //--@updateBy-end----author:liusq---date:20211117------for:上传判断是否返回res信息------
        } else {
          if (res.data.success == true && res.data.code == 200) {
            createMessage.success(res.data.message);
          } else {
            createMessage.error(res.data.message);
          }
        }
      });
  }

  // 支持表单数据
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (contentType !== ContentTypeEnum.FORM_URLENCODED || !Reflect.has(config, 'data') || config.method?.toUpperCase() === RequestEnum.GET) {
      return config;
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    };
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options);
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options);
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config);
    const transform = this.getTransform();

    const { requestOptions } = this.options;

    /**
     *
     * 1.一般我们调用get方法发送请求都是 defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, {})
     * 其中第一个参数是 AxiosRequestConfig 对象，这是Axios的配置对象，defHttp.get会进入这里的request
     *
     * 这里的request方法本质上是代理使用了 Axios的axios.request(config)方法
     * defHttp.get的第二个参数是空对象，虽然参数是空对象，下面的代码会将空对象和默认的requestOptions合并
     *
     * 项目默认的requestOptions 中配置了 apiUrl: globSetting.apiUrl=/jeectboot.
     * 然后请求被发送，进入到请求拦截器 beforeRequestHook，判断apiUrl不为空，则添加到url前面，因此整个请求的url变成了
     * /jeecgboot/sys/user/getUserInfo，而这个请求地址以/jeecgboot开头 会被代理到 http://localhost:8080/jeecg-boot
     *
     * 这里想表达的意思是：项目在配置Axios实例的时候并没有配置baseUrl属性. 如果你配置了baseUrl，那么每个请求的前面都会添加该前缀。
     * 当有多个后天服务器接口的时候，如何配置请求代理到不同的后台服务器呢？
     *
     * 因此基于这样的原理，默认情况下 都会在请求的url前面添加上 apiUrl: globSetting.apiUrl=/jeectboot.
     *
     * 那么假设我有一个 product接口，接口的后端地址是 http://localshot:10000/product/:brandId/list 查询某一个品牌的产品。那么如何配置？
     * 首先 需要配置代理将 /product 代理到 http://localshot:10000/product， 也就是在 vite.config.ts中配置['/product', 'http://localshot:10000/product']
     * 因为在proxy.ts中创建代理的时候会把请求/product/abc 重写成去掉前缀/product，然后拼接到代理的地址上，也就是 http://localshot:10000/product/abc
     * 因此，我们发送的请求地址需要以/product前缀开头，可以在发送请求的时候传递配置对象 {'apiUrl’:'/product'}
     * defHttp.get({url:'xiaomi/list'},{'apiUrl’:'/product'}) 这样就相当于使用 {'apiUrl’:'/product'} 覆盖了默认的requestOptions的apiUrl,从而
     * 实现了在请求url前添加/product前缀
     *
     *
     *
     */
    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;

    conf = this.supportFormData(conf);

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          /**
           * 如果transformRequestHook存在，则对请求响应数据进行处理。
           */
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt);
              //zhangyafei---添加回调方法
              config.success && config.success(res.data);
              //zhangyafei---添加回调方法
              resolve(ret);
            } catch (err) {
              reject(err || new Error('request error!'));
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
            return;
          }
          if (axios.isAxiosError(e)) {
            // 在此处重写来自axios的错误消息
          }
          reject(e);
        });
    });
  }

  /**
   * 【用于评论功能】自定义文件上传-请求
   * @param url
   * @param formData
   */
  uploadMyFile<T = any>(url, formData) {
    const glob = useGlobSetting();
    return this.axiosInstance.request<T>({
      url: url,
      baseURL: glob.uploadUrl,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        ignoreCancelToken: true,
      },
    });
  }
}
