import { getStorageShortName } from '/@/utils/env';
import { createStorage as create, CreateStorageParams } from './storageCache';
import { enableStorageEncryption } from '/@/settings/encryptionSetting';
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';

/**
 * Partial<T>: 该工具类型能够构造一个新类型，并将实际类型参数T中的所有属性变为可选属性。
 */
export type Options = Partial<CreateStorageParams>;

const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    // No encryption in debug mode
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
    ...options,
  };
};

export const WebStorage = create(createOptions(sessionStorage));

/**
 * storage: Storage = sessionStorage： 参数类型，参数默认值
 * @param storage
 * @param options
 */
export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => {
  return create(createOptions(storage, options));
};

export const createSessionStorage = (options: Options = {}) => {
  return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export const createLocalStorage = (options: Options = {}) => {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export default WebStorage;
