import { baseUrl, resultSuccess } from '../_util';
import { MockMethod } from 'vite-plugin-mock';

/**
 * question: 这里导入 src目录下的一个enum
 *
 * 为什么这两行代码会编译报错
 * let getProductList:ShProductAPI=ShProductAPI.GetProductList;
 * console.log("getProductList",getProductList)
 *
 */
// @ts-ignore
import {ShProductAPI} from "@/api/sachin/shproduct";


export default [
  {
    url: `${baseUrl}/product/list`,
    timeout: 2000,
    method: 'get',
    response: () => {
      const data = [
        {
          name: '手机',
          price: 100,
        },
        {
          name: '电脑',
          price: 1000,
        },
        {
          name: '电视',
          price: 2000,
        },
      ];
      return resultSuccess(data);
    },
  },
] as MockMethod[];
