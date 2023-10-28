import {defHttp} from '@/utils/http/axios';
import {baseUrl} from '../../../mock/_util';

export enum ShProductAPI {
    GetProductList = '/product/list',
}

export const getProductList = (params) => {
    return defHttp.get(
        {url: ShProductAPI.GetProductList, params},
        {
            //注意 这里需要指定 添加到url的前缀为/jeecgboot/mock
            //这样完整的路径就是 /jeectboot/mock/product/list
            //mockserver中配置的mockmethod都是以/jeecgboot/mock开头的
            apiUrl: baseUrl,
        }
    );
};
