import { cacheCipher } from '/@/settings/encryptionSetting';

/**
 * cipher: 密码;暗号;无足轻重的人;
 */
import type { EncryptionParams } from '/@/utils/cipher';

import { AesEncryption } from '/@/utils/cipher';

import { isNullOrUnDef } from '/@/utils/is';

export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string;
  storage: Storage;
  hasEncrypt: boolean;
  timeout?: Nullable<number>;
}

/**
 *
 * 在这段代码中，Partial<CreateStorageParams> = {} 是 TypeScript 中的一种类型定义语法，
 * 用于指定函数参数的类型。让我来解释它的意思：
 *
 * CreateStorageParams 类型： 假设有一个叫做 CreateStorageParams 的类型或者接口，它表示一个对象，该对象包含了一
 * 系列参数，例如 prefixKey、storage、key、iv、timeout 和 hasEncrypt。
 *
 * Partial<CreateStorageParams>： TypeScript 中的 Partial<T> 泛型类型表示将类型 T 中的所有属性变为可选的。也
 * 就是说，Partial<CreateStorageParams> 表示 CreateStorageParams 类型的所有属性都是可选的，可以不传递任何
 * 属性值，或者只传递其中的一部分属性值。
 *
 * = {}： 这部分表示函数的参数默认值，如果调用函数时没有传递参数，那么将会使用默认的空对象 {} 作为参数。
 *
 * 综合起来，Partial<CreateStorageParams> = {} 的意思是，createStorage 函数的参数是一个可选的对象，
 * 其属性可以是 CreateStorageParams 类型中定义的任意属性，而且这些属性都是可选的。如果不传递参
 * 数，函数将使用一个空对象作为默认参数。
 *
 *
 * 2.{
 *   prefixKey = '',
 *   storage = sessionStorage,
 *   key = cacheCipher.key,
 *   iv = cacheCipher.iv,
 *   timeout = null,
 *   hasEncrypt = true,
 * } 是函数参数的解构默认值
 *
 * 3. Web  Storage 定义了两个对象用于存储数据： sessionStorage 和 localStorage 。前者用于严格*保存浏览器一次会话
 * 期间的数据，因为数据会在浏览器关闭时被删除。后者用于会话之外持久保存数据。
 * @param prefixKey
 * @param storage
 * @param key
 * @param iv
 * @param timeout
 * @param hasEncrypt
 */
export const createStorage = ({
  prefixKey = '',
  storage = sessionStorage,
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  timeout = null,
  hasEncrypt = true,
}: Partial<CreateStorageParams> = {}) => {
  if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
    throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
  }

  const encryption = new AesEncryption({ key, iv });

  /**
   *Cache class
   *Construction parameters can be passed into sessionStorage, localStorage,
   * @class Cache
   * @example
   */
  const WebStorage = class WebStorage {
    private storage: Storage;
    private prefixKey?: string;
    private encryption: AesEncryption;
    private hasEncrypt: boolean;
    /**
     *
     * @param {*} storage
     */
    constructor() {
      this.storage = storage;
      this.prefixKey = prefixKey;
      this.encryption = encryption;
      this.hasEncrypt = hasEncrypt;
    }

    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     *
     *  Set cache
     * @param {string} key
     * @param {*} value
     * @expire Expiration time in seconds
     * @memberof Cache
     */
    set(key: string, value: any, expire: number | null = timeout) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null,
      });
      const stringifyValue = this.hasEncrypt ? this.encryption.encryptByAES(stringData) : stringData;
      this.storage.setItem(this.getKey(key), stringifyValue);
    }

    /**
     *Read cache
     * @param {string} key
     * @memberof Cache
     */
    get(key: string, def: any = null): any {
      const val = this.storage.getItem(this.getKey(key));
      if (!val) return def;

      try {
        const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val;
        const data = JSON.parse(decVal);
        const { value, expire } = data;
        if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
          return value;
        }
        this.remove(key);
      } catch (e) {
        return def;
      }
    }

    /**
     * Delete cache based on key
     * @param {string} key
     * @memberof Cache
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key));
    }

    /**
     * Delete all caches of this instance
     */
    clear(): void {
      this.storage.clear();
    }
  };
  return new WebStorage();
};
