<!--
 Access control component for fine-grained access control.
-->
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getSlot } from '/@/utils/helper/tsxHelper';

  export default defineComponent({
    name: 'Authority',
    props: {
      /**
       * Specified role is visible
       * When the permission mode is the role mode, the value value can pass the role value.
       * When the permission mode is background, the value value can pass the code permission value
       * @default ''
       */
      value: {
        type: [Number, Array, String] as PropType<RoleEnum | RoleEnum[] | string | string[]>,
        default: '',
      },
    },
    /**
     * setup函数的签名：setup?: (this: void, props: xxx, 'P'>>>, ctx: SetupContext<E, S>) => Promise<RawBindings> | RawBindings | RenderFunction | void;
     * setup?: - 这表示 setup 参数是可选的。
     * this: void - 表示函数中的 this 上下文（在这个函数内部，this 的值为 undefined）。
     * Promise<RawBindings> | RawBindings | RenderFunction | void - 这是函数的返回值
     * 其中RenderFunction - 表示一个渲染函数，通常用于返回组件的渲染结果。
     *
     * @param props
     * @param slots
     */
    setup(props, { slots }) {
      const { hasPermission } = usePermission();

      /**
       * Render role button
       */
      function renderAuth() {
        const { value } = props;
        /**
         * 如果没有设置value，则返回slots中的default slot
         */
        if (!value) {
          return getSlot(slots);
        }
        return hasPermission(value) ? getSlot(slots) : null;
      }

      return () => {
        // Role-based value control
        return renderAuth();
      };
    },
  });
</script>
