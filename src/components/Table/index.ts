/**
 * 通过重命名，部分导出从另一个模块导入的项目： export { someVar as aDifferentName } from './foo'
 * import {default as BasicTable} from './src/BasicTable.vue';
 * export BasicTable;
 *
 * export { default } from './mod'  这会从mod中导出default并作为当前模块的默认导出
 * export {a as defualt} from './mod'  这会从mod中导出a并作为当前模块的默认导出
 * 因此导入其他模块的default 必须要as重命名，否则会被当作当前模块的default，也就是默认as default
 */

export { default as BasicTable } from './src/BasicTable.vue';
export { default as TableAction } from './src/components/TableAction.vue';
export { default as EditTableHeaderIcon } from './src/components/EditTableHeaderIcon.vue';
export { default as TableImg } from './src/components/TableImg.vue';
export * from './src/types/table';
export * from './src/types/pagination';
export * from './src/types/tableAction';
export { useTable } from './src/hooks/useTable';
export type { FormSchema, FormProps } from '/@/components/Form/src/types/form';
export type { EditRecordRow } from './src/components/editable';
