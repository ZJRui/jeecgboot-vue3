<template>
  <PageWrapper>
    <sh-basic-table :columns="columns" :data-source="data" :loading="loading">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>
            <smile-outlined />
            Name
          </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a>
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'tags'">
          <span>
            <a-tag v-for="tag in record.tags" :key="tag" :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a>Invite 一 {{ record.name }}</a>
            <a-divider type="vertical" />
            <a>Delete</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link">
              More actions
              <down-outlined />
            </a>
          </span>
        </template>
      </template>
    </sh-basic-table>

    <hr />
    <ComponentA v-bind="personRef" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import SachinJvextableDemoA from '@/views/demo/sachin/jvxetabledemo/SachinJvextableDemoA.vue';
  import keepalivecomp from '@/views/demo/sachin/jvxetabledemo/keepalivecomp.vue';
  import ShBasicTable from '@/components/Table/src/ShBasicTable.vue';
  import ComponentA from '@/views/demo/sachin/jvxetabledemo/ComponentA.vue';
  import { ref,onUnmounted,onMounted,onDeactivated,onActivated,onUpdated } from 'vue';

  /**
   * 该组件的菜单已经开启了缓存。 要想缓存生效，组件的name需要和组件被访问的url匹配。
   */
  defineOptions({
    name:"comp-sachindemo-jvextable"
  })

  const columns = [
    {
      name: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
    },
    {
      title: 'Action',
      key: 'action',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  const refDataSourceB = ref(data);
  const refColumnsB = ref(columns);

  const loading = ref(false);

  const personRef = ref({
    name: 'sachin',
    age: 18,
    address: 'shanghai',
  });

  onMounted(() => {
    console.log('jvxetabledemo/index.vue mounted');
  });
  onUnmounted(() => {
    console.log('jvxetabledemo/index.vue unmounted');
  });
  onDeactivated(() => {
    console.log('jvxetabledemo/index.vue deactivated');
  });
  onActivated(() => {
    console.log('jvxetabledemo/index.vue activated');
  });
</script>
