import { defHttp } from '@/utils/http/axios';

enum RoleApi {
  list = 'sys/role/list',
  save = '/sys/role/add',
  edit = '/sys/role/edit',
}
export const list = (params) =>
  defHttp.get({
    url: RoleApi.list,
    params,
  });

export const add = (params) =>
  defHttp.post({
    url: RoleApi.save,
    params,
  });

export const update = (params) =>
  defHttp.post({
    url: RoleApi.edit,
    params,
  });
