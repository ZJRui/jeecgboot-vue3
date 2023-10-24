// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosResponse } from 'axios';
import type { RequestOptions, Result } from '/#/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { checkStatus } from './checkStatus';
import { router } from '/@/router';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';
import { RequestEnum, ResultEnum, ContentTypeEnum, ConfigEnum } from '/@/enums/httpEnum';
import { isString } from '/@/utils/is';
import { getToken, getTenantId } from '/@/utils/auth';
import { setObjToUrlParams, deepMerge } from '/@/utils';
import signMd5Utils from '/@/utils/encryption/signMd5Utils';
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog';
import { useI18n } from '/@/hooks/web/useI18n';
import { joinTimestamp, formatRequestDate } from './helper';
import { useUserStoreWithOut } from '/@/store/modules/user';
const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { createMessage, createErrorModal } = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    /**
     * 1.example:
     * {
     *     "joinPrefix": true,
     *     "isReturnNativeResponse": false,
     *     "isTransformResponse": true,
     *     "joinParamsToUrl": false,
     *     "formatDate": true,
     *     "errorMessageMode": "message",
     *     "successMessageMode": "success",
     *     "apiUrl": "/jeecgboot",
     *     "urlPrefix": "",
     *     "joinTime": true,
     *     "ignoreCancelToken": true,
     *     "withToken": true
     * }
     *
     * 2.transformRequestHook 是说对请求返回的响应进行处理，是响应处理阶段，而不是说针对请求参数进行处理，常见的调用堆栈是
     * store中发出请求，然后Promise.then中处理请求。axios.request().then((res)=>{tranformRequestHook(res)})
     * transformRequestHook (index.ts:56)
     * （匿名） (Axios.ts:229)
     * Promise.then（异步）
     * （匿名） (Axios.ts:226)
     * request (Axios.ts:223)
     * get (Axios.ts:192)
     * getUserInfo (user.ts:81)
     * getUserInfoAction (user.ts:204)
     * （匿名） (pinia.mjs:1375)
     * store.<computed> (pinia.mjs:930)
     *
     * 因此这里的res 是Axios的Response
     */
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    /**
     * 1.错误的时候返回，从Axios的Reponse中解构出 业务接口返回的数据
     * 2.示例data，
     * {
     *     "success": true,
     *     "message": "",
     *     "code": 200,
     *     "result": {
     *         "userInfo": {
     *         },
     *     },
     *     "timestamp": 1698032662689
     * }
     */
    const { data } = res;
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error(t('sys.api.apiRequestFailed'));
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, result, message, success } = data;
    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, 'code') && (code === ResultEnum.SUCCESS || code === 200);
    if (hasSuccess) {
      /**
       * 如果message为空，或者message='',则 true&&''='', true&&''&&true=''
       * if('')为false， ‘’====true为false，所以也就是message为空的时候不会执行if内部的代码
       *
       * 在JavaScript中，当使用逻辑与（&&）运算符时，如果第一个操作数为true，则返回第二个操作数，否则返回第一个操作数。
       */
      if (success && message && options.successMessageMode === 'success') {
        //信息成功提示
        createMessage.success(message);
      }
      return result;
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = '';
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = t('sys.api.timeoutMessage');
        const userStore = useUserStoreWithOut();
        userStore.setToken(undefined);
        userStore.logout(true);
        break;
      default:
        if (message) {
          timeoutMsg = message;
        }
    }

    // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMessageMode === 'modal') {
      createErrorModal({ title: t('sys.api.errorTip'), content: timeoutMsg });
    } else if (options.errorMessageMode === 'message') {
      createMessage.error(timeoutMsg);
    }

    throw new Error(timeoutMsg || t('sys.api.apiRequestFailed'));
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    /**
     * 如果请求中有data数据，且配置中formatDate为true，则对data中的时间进行格式化
     */
    formatDate && data && !isString(data) && formatRequestDate(data);
    /**
     * get请求添加时间戳
     */
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data));
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config: Recordable, options) => {
    // 请求之前处理config
    const token = getToken();
    let tenantid = getTenantId();
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      /**
       * 1.jwt token
       * 2. options.authenticationScheme 为空，因为index.ts中createAxios的配置参数为空，
       * 然后在deepMerge 中 authenticationScheme: '',
       *3.为什么要设置请求头 名称为‘authorization'的头
       * （1）服务器端向客户端返回 401（Unauthorized，未被授权的）响应状态码，并在 WWW-Authenticate 响应标头提供如何进行验证的信息，
       *  其中至少包含有一种质询方式。比如： WWW-Authenticate: Basic realm="Usagidesign Auth"
       * （2）之后，想要使用服务器对自己身份进行验证的客户端，可以通过包含凭据的 Authorization 请求标头进行验证。
       * （3）通常，客户端会向用户显示密码提示，然后发送包含正确的 Authorization 标头的请求。
       *
       *
       */
      config.headers.Authorization = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token;
      config.headers[ConfigEnum.TOKEN] = token;
      //--update-begin--author:liusq---date:20210831---for:将签名和时间戳，添加在请求接口 Header

      // update-begin--author:taoyan---date:20220421--for: VUEN-410【签名改造】 X-TIMESTAMP牵扯
      config.headers[ConfigEnum.TIMESTAMP] = signMd5Utils.getTimestamp();
      // update-end--author:taoyan---date:20220421--for: VUEN-410【签名改造】 X-TIMESTAMP牵扯

      config.headers[ConfigEnum.Sign] = signMd5Utils.getSign(config.url, config.params);
      //--update-end--author:liusq---date:20210831---for:将签名和时间戳，添加在请求接口 Header
      //--update-begin--author:liusq---date:20211105---for: for:将多租户id，添加在请求接口 Header
      if (!tenantid) {
        tenantid = 0;
      }
      config.headers[ConfigEnum.TENANT_ID] = tenantid;
      //--update-begin--author:liusq---date:20220325---for: 增加vue3标记
      config.headers[ConfigEnum.VERSION] = 'v3';
      //--update-end--author:liusq---date:20220325---for:增加vue3标记
      //--update-end--author:liusq---date:20211105---for:将多租户id，添加在请求接口 Header

      // ========================================================================================
      // update-begin--author:sunjianlei---date:20220624--for: 添加低代码应用ID
      let routeParams = router.currentRoute.value.params;
      if (routeParams.appId) {
        config.headers[ConfigEnum.X_LOW_APP_ID] = routeParams.appId;
        // lowApp自定义筛选条件
        if (routeParams.lowAppFilter) {
          config.params = { ...config.params, ...JSON.parse(routeParams.lowAppFilter as string) };
          delete routeParams.lowAppFilter;
        }
      }
      // update-end--author:sunjianlei---date:20220624--for: 添加低代码应用ID
      // ========================================================================================
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    //scott 20211022 token失效提示信息
    //const msg: string = response?.data?.error?.message ?? '';
    const msg: string = response?.data?.message ?? '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage');
      }
      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error);
    }

    checkStatus(error?.response?.status, msg, errorMessageMode);
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 异常消息提示类型
          errorMessageMode: 'message',
          // 成功消息提示类型
          successMessageMode: 'success',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
      },
      opt || {}
    )
  );
}
export const defHttp = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//   },
// });
