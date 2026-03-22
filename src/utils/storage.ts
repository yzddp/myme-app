/**
 * MyMe App - Storage Utility
 * 本地存储工具 - AsyncStorage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "myme_";

// 同步缓存（用于需要同步读取的场景）
const syncCache: Record<string, string> = {};
let cacheLoaded = false;

const loadCache = async () => {
  if (cacheLoaded) return;
  const keys = await AsyncStorage.getAllKeys();
  const mymeKeys = keys.filter((k) => k.startsWith(PREFIX));
  if (mymeKeys.length > 0) {
    const values = await AsyncStorage.multiGet(mymeKeys);
    values.forEach(([key, value]) => {
      if (value) {
        syncCache[key.substring(PREFIX.length)] = value;
      }
    });
  }
  cacheLoaded = true;
};

// 初始化加载缓存
loadCache().catch(console.error);

export const storage = {
  getString: (key: string): string | undefined => {
    return syncCache[key];
  },
  set: (key: string, value: string): void => {
    syncCache[key] = value;
    AsyncStorage.setItem(PREFIX + key, value).catch(console.error);
  },
  delete: (key: string): void => {
    delete syncCache[key];
    AsyncStorage.removeItem(PREFIX + key).catch(console.error);
  },
  getBoolean: (key: string): boolean | undefined => {
    const value = syncCache[key];
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
  },
  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, String(value));
  },
  getNumber: (key: string): number | undefined => {
    const value = syncCache[key];
    if (value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  },
  setNumber: (key: string, value: number): void => {
    storage.set(key, String(value));
  },
  contains: (key: string): boolean => {
    return key in syncCache;
  },
  getAllKeys: (): string[] => {
    return Object.keys(syncCache);
  },
  clearAll: (): void => {
    Object.keys(syncCache).forEach((key) => delete syncCache[key]);
    AsyncStorage.getAllKeys()
      .then((keys) => {
        const mymeKeys = keys.filter((k) => k.startsWith(PREFIX));
        AsyncStorage.multiRemove(mymeKeys).catch(console.error);
      })
      .catch(console.error);
  },
};

// 异步工具函数
export const storageUtils = {
  getString: async (key: string): Promise<string | undefined> => {
    const value = await AsyncStorage.getItem(PREFIX + key);
    return value ?? undefined;
  },
  setString: async (key: string, value: string): Promise<void> => {
    syncCache[key] = value;
    await AsyncStorage.setItem(PREFIX + key, value);
  },
  getObject: async <T>(key: string): Promise<T | undefined> => {
    const value = await AsyncStorage.getItem(PREFIX + key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return undefined;
      }
    }
    return undefined;
  },
  setObject: async <T>(key: string, value: T): Promise<void> => {
    const json = JSON.stringify(value);
    syncCache[key] = json;
    await AsyncStorage.setItem(PREFIX + key, json);
  },
  delete: async (key: string): Promise<void> => {
    delete syncCache[key];
    await AsyncStorage.removeItem(PREFIX + key);
  },
  clearAll: async (): Promise<void> => {
    Object.keys(syncCache).forEach((key) => delete syncCache[key]);
    const keys = await AsyncStorage.getAllKeys();
    const mymeKeys = keys.filter((k) => k.startsWith(PREFIX));
    await AsyncStorage.multiRemove(mymeKeys);
  },
};

export default storageUtils;
