/**
 * MyMe App - Storage Utility
 * 本地存储工具 - MMKV (Web使用localStorage兼容)
 */

import { Platform } from "react-native";
import { MMKV } from "react-native-mmkv";

// Web存储兼容层
class WebStorage {
  private prefix = "myme_";

  getString(key: string): string | undefined {
    const value = localStorage.getItem(this.prefix + key);
    return value ?? undefined;
  }

  set(key: string, value: string): void {
    localStorage.setItem(this.prefix + key, value);
  }

  delete(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  getBoolean(key: string): boolean | undefined {
    const value = localStorage.getItem(this.prefix + key);
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
  }

  setBoolean(key: string, value: boolean): void {
    localStorage.setItem(this.prefix + key, String(value));
  }

  getNumber(key: string): number | undefined {
    const value = this.getString(key);
    if (value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }

  setNumber(key: string, value: number): void {
    localStorage.setItem(this.prefix + key, String(value));
  }

  contains(key: string): boolean {
    return localStorage.getItem(this.prefix + key) !== null;
  }

  getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }

  clearAll(): void {
    const keys = this.getAllKeys();
    keys.forEach((key) => this.delete(key));
  }
}

// 创建MMKV实例或Web存储
const createStorage = () => {
  if (Platform.OS === "web") {
    return new WebStorage() as unknown as MMKV;
  }
  return new MMKV({
    id: "myme-storage",
    encryptionKey: "myme-encryption-key",
  });
};

export const storage = createStorage();

// 存储工具函数
export const storageUtils = {
  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },
  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },
  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },
  setNumber: (key: string, value: number): void => {
    storage.set(key, value);
  },
  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },
  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, value);
  },
  getObject: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return undefined;
      }
    }
    return undefined;
  },
  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },
  delete: (key: string): void => {
    storage.delete(key);
  },
  contains: (key: string): boolean => {
    return storage.contains(key);
  },
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },
  clearAll: (): void => {
    storage.clearAll();
  },
};

export default storageUtils;
