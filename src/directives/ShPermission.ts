import { App } from 'vue';

const shAuthDirective = {
  mounted(el, binding) {
    function hasPermission(value) {
      const permissionList = ['add', 'update', 'delete'];
      return permissionList.includes(value);
    }
    //获取指令绑定的值
    const value = binding.value;
    if (!value) {
      return;
    }
    if (!hasPermission(value)) {
      el.parentNode?.removeChild(el);
    }
  },
};
export function setupShPermissionDirective(app: App) {
  app.directive('sh-auth', shAuthDirective);
}

export default shAuthDirective;
