import type { App } from 'vue';
import { Icon } from './Icon';
import AIcon from '/@/components/jeecg/AIcon.vue';
import { Button, JUploadButton } from './Button';
//Tinymce富文本
import Editor from '/@/components/Tinymce/src/Editor.vue';

import {
  // Need
  Button as AntButton,//ant原生的Button 重新起个名字叫做AntButton,项目中使用给自己实现的Button，该Button中引用了Ant的Button
  Select,
  Alert,
  Checkbox,
  DatePicker,
  TimePicker,
  Calendar,
  Radio,
  Switch,
  Card,
  List,
  Tabs,
  Descriptions,
  Tree,
  Table,
  Divider,
  Modal,
  Drawer,
  TreeSelect,
  Dropdown,
  Tag,
  Tooltip,
  Badge,
  Popover,
  Upload,
  Transfer,
  Steps,
  PageHeader,
  Result,
  Empty,
  Avatar,
  Menu,
  Breadcrumb,
  Form,
  Input,
  Row,
  Col,
  Spin,
  Space,
  Layout,
  Collapse,
  Slider,
  InputNumber,
  Carousel,
  Popconfirm,
  Skeleton,
  Cascader,
  Rate,
} from 'ant-design-vue';

const compList = [AntButton.Group, Icon, AIcon, JUploadButton];

//敲敲云—仪表盘设计器（拖拽设计）
import DragEngine from '@qiaoqiaoyun/drag-free';
if (import.meta.env.DEV) {
  import('@qiaoqiaoyun/drag-free/lib/index.css');
}
console.log('---初始化---， 全局注册仪表盘--------------');

export function registerGlobComp(app: App) {
  /**
   *
   *
   */
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });
  //仪表盘依赖Tinymce，需要提前加载（没办法按需加载了）
  app.component(Editor.name, Editor);

  /**
   * 1.vue3中注册组件是使用 app.component(name,component) 注册组件，如果同时传递一个组件名字符串及其定义，则注册一个全局组件；
   * 如果只传递一个名字，则会返回用该名字注册的组件 (如果存在的话)。
   *
   * 而app.use 是安装一个插件。第一个参数应是插件本身，可选的第二个参数是要传递给插件的选项。插件可以是一个带 install() 方法的对象，
   * 亦或直接是一个将被用作 install() 方法的函数。插件选项 (app.use() 的第二个参数) 将会传递给插件的 install() 方法。
   *
   * 为什么下面的注册组件要使用use方法来注册组件？ 既然组件被作为插件使用，那么ant的组件是哪里定义的插件install方法
   *
   * 2.为什么要use? 因为官网的示例导入就是
   * import { DatePicker } from 'ant-design-vue';
   * app.use(DatePicker);
   * use(Button):  会自动注册 Button 下的子组件, 例如 Button.Group *
   * 以Select组件为例子：node_modules/.pnpm/ant-design-vue@3.2.20_vue@3.3.4/node_modules/ant-design-vue/lib/select/index.js
   * Select.install = function (app) {
   *   //注册Select组件自身和其子组件
   *   app.component(Select.name, Select);
   *   app.component(Select.Option.displayName, Select.Option);
   *   app.component(Select.OptGroup.displayName, Select.OptGroup);
   *   return app;
   * };
   *
   *
   */
  app
    .use(Select)
    .use(Alert)
    .use(Button)
    .use(Breadcrumb)
    .use(Checkbox)
    .use(DatePicker)
    .use(TimePicker)
    .use(Calendar)
    .use(Radio)
    .use(Switch)
    .use(Card)
    .use(List)
    .use(Descriptions)
    .use(Tree)
    .use(TreeSelect)
    .use(Table)
    .use(Divider)
    .use(Modal)
    .use(Drawer)
    .use(Dropdown)
    .use(Tag)
    .use(Tooltip)
    .use(Badge)
    .use(Popover)
    .use(Upload)
    .use(Transfer)
    .use(Steps)
    .use(PageHeader)
    .use(Result)
    .use(Empty)
    .use(Avatar)
    .use(Menu)
    .use(Tabs)
    .use(Form)
    .use(Input)
    .use(Row)
    .use(Col)
    .use(Spin)
    .use(Space)
    .use(Layout)
    .use(Collapse)
    .use(Slider)
    .use(InputNumber)
    .use(Carousel)
    .use(Popconfirm)
    .use(DragEngine)
    .use(Skeleton)
    .use(Cascader)
    .use(Rate);
  console.log('注册antd组件完成！');
}
