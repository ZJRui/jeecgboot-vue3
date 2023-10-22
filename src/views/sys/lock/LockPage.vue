<template>
  <div :class="prefixCls" class="fixed inset-0 flex h-screen w-screen bg-black items-center justify-center">
    <div
      :class="`${prefixCls}__unlock`"
      class="absolute top-0 left-1/2 flex pt-5 h-16 items-center justify-center sm:text-md xl:text-xl text-white flex-col cursor-pointer transform translate-x-1/2"
      @click="handleShowForm(false)"
      v-show="showDate"
    >
      <LockOutlined />
      <span>{{ t('sys.lock.unlock') }}</span>
    </div>

    <div class="flex w-screen h-screen justify-center items-center">
      <div :class="`${prefixCls}__hour`" class="relative mr-5 md:mr-20 w-2/5 h-2/5 md:h-4/5">
        <span>{{ hour }}</span>
        <span class="meridiem absolute left-5 top-5 text-md xl:text-xl" v-show="showDate">
          {{ meridiem }}
        </span>
      </div>
      <div :class="`${prefixCls}__minute w-2/5 h-2/5 md:h-4/5 `">
        <span> {{ minute }}</span>
      </div>
    </div>
    <transition name="fade-slide">
      <div :class="`${prefixCls}-entry`" v-show="!showDate">
        <div :class="`${prefixCls}-entry-content`">
          <div :class="`${prefixCls}-entry__header enter-x`">
            <img :src="userinfo.avatar || headerImg" :class="`${prefixCls}-entry__header-img`" />
            <p :class="`${prefixCls}-entry__header-name`">
              {{ userinfo.realname }}
            </p>
          </div>
          <InputPassword :placeholder="t('sys.lock.placeholder')" class="enter-x" v-model:value="password" />
          <span :class="`${prefixCls}-entry__err-msg enter-x`" v-if="errMsg">
            {{ t('sys.lock.alert') }}
          </span>
          <div :class="`${prefixCls}-entry__footer enter-x`">
            <a-button type="link" size="small" class="mt-2 mr-2 enter-x" :disabled="loading" @click="handleShowForm(true)">
              {{ t('common.back') }}
            </a-button>
            <a-button type="link" size="small" class="mt-2 mr-2 enter-x" :disabled="loading" @click="goLogin">
              {{ t('sys.lock.backToLogin') }}
            </a-button>
            <a-button class="mt-2" type="link" size="small" @click="unLock()" :loading="loading">
              {{ t('sys.lock.entry') }}
            </a-button>
          </div>
        </div>
      </div>
    </transition>

    <div class="absolute bottom-5 w-full text-gray-300 xl:text-xl 2xl:text-3xl text-center enter-y">
      <div class="text-5xl mb-4 enter-x" v-show="!showDate">
        {{ hour }}:{{ minute }} <span class="text-3xl">{{ meridiem }}</span>
      </div>
      <div class="text-2xl"> {{ year }}/{{ month }}/{{ day }} {{ week }} </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Input } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useLockStore } from '/@/store/modules/lock';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useNow } from './useNow';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { LockOutlined } from '@ant-design/icons-vue';
  import headerImg from '/@/assets/images/header.jpg';

  const InputPassword = Input.Password;

  const password = ref('');
  const loading = ref(false);
  const errMsg = ref(false);
  const showDate = ref(true);

  const { prefixCls } = useDesign('lock-page');
  const lockStore = useLockStore();
  const userStore = useUserStore();

  const { hour, month, minute, meridiem, year, day, week } = useNow(true);

  const { t } = useI18n();

  const userinfo = computed(() => {
    return userStore.getUserInfo || {};
  });

  /**
   * @description: unLock
   */
  async function unLock() {
    if (!password.value) {
      return;
    }
    let pwd = password.value;
    try {
      loading.value = true;
      const res = await lockStore.unLock(pwd);
      errMsg.value = !res;
    } finally {
      loading.value = false;
    }
  }

  function goLogin() {
    userStore.logout(true);
    lockStore.resetLockInfo();
  }

  function handleShowForm(show = false) {
    showDate.value = show;
  }
</script>
<style lang="less" scoped>
  /**
 *1.这里是定义less的变量 @prefix-cls，
 * 2. ~ 表示转义： 转义允许您使用任意字符串作为属性或变量值。  或  内的任何内容均按原样使用，
 除了  ~"anything"  ~'anything' 插值之外没有任何更改。
  在 Less 中，~ 符号用于防止字符串插值的发生。通常，当你在字符串中使用插值语法（@{variable}）时，Less 会尝
  试将变量的值直接嵌入到字符串中。但是，如果你希望字符串中的插值语法保持为普通文本，而不被 Less 处理，就可以使用 ~ 符号。
  在这个例子中，@{namespace} 是一个 Less 变量，它可能是一个命名空间的名称。@prefix-cls 的值是一个字符‘
  串 @{namespace}-lock-page，这个字符串中的插值语法被保留为普通文本，不会被解析。这样，@prefix-cls 的值会保持
  为 @{namespace}-lock-page，直到在 Less 中使用它的时候才会被实际解析。这种方式可以用于构建动态的类名或
  选择器，根据命名空间的不同而变化

  3.question: @{namespace} 这个好像是less的针对变量的插值语法，@namespace变量的定义是在 /var/index.less中定义的。
 */
  @prefix-cls: ~'@{namespace}-lock-page';

  /**
  note:less的变量插值  @{varName}
   */
  .@{prefix-cls} {
    z-index: @lock-page-z-index;

    &__unlock {
      transform: translate(-50%, 0);
    }

    &__hour,
    &__minute {
      display: flex;
      font-weight: 700;
      color: #bababa;
      background-color: #141313;
      border-radius: 30px;
      justify-content: center;
      align-items: center;

      @media screen and (max-width: @screen-md) {
        span:not(.meridiem) {
          font-size: 160px;
        }
      }

      @media screen and (min-width: @screen-md) {
        span:not(.meridiem) {
          font-size: 160px;
        }
      }

      @media screen and (max-width: @screen-sm) {
        span:not(.meridiem) {
          font-size: 90px;
        }
      }
      @media screen and (min-width: @screen-lg) {
        span:not(.meridiem) {
          font-size: 220px;
        }
      }

      @media screen and (min-width: @screen-xl) {
        span:not(.meridiem) {
          font-size: 260px;
        }
      }
      @media screen and (min-width: @screen-2xl) {
        span:not(.meridiem) {
          font-size: 320px;
        }
      }
    }

    &-entry {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      justify-content: center;
      align-items: center;

      &-content {
        width: 260px;
      }

      &__header {
        text-align: center;

        &-img {
          width: 70px;
          margin: 0 auto;
          border-radius: 50%;
        }

        &-name {
          margin-top: 5px;
          font-weight: 500;
          color: #bababa;
        }
      }

      &__err-msg {
        display: inline-block;
        margin-top: 10px;
        color: @error-color;
      }

      &__footer {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
